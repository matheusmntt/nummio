/*
 * A classical head, modelled with signed distance functions and raymarched,
 * then printed as an ordered dither in the brand's inks. Everything on the
 * plate is computed here; no image is sampled.
 */

export const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uBlock;     // dither cell, in render pixels (1 = finest)
uniform float uScan;      // 0..1 from the top: rows above are printed, rows below are continuous tone
uniform float uExposure;  // 0..1, the form rising out of the dark
uniform float uLight;     // key light azimuth, radians
uniform float uYaw;       // head turn, radians
uniform float uPattern;   // 0 = Bayer matrix, 1 = interleaved noise
uniform vec2 uPhase;      // shifts the dither pattern so it crawls
uniform vec3 uGround;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec3 uTone;       // continuous-tone marble colour

out vec4 outColor;

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

mat3 rotateY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotateX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}

// Tight curls: a jittered lattice of rounded knots, 0 between knots and 1 at their crowns.
float curls(vec3 p) {
  vec3 q = p * 10.0;
  vec3 id = floor(q);
  vec3 f = fract(q);
  float nearest = 1.0;
  for (int k = 0; k < 8; k++) {
    vec3 o = vec3(float(k & 1), float((k >> 1) & 1), float((k >> 2) & 1));
    nearest = min(nearest, length(f - o - (hash3(id + o) - 0.5) * 0.6));
  }
  return 1.0 - smoothstep(0.0, 0.72, nearest);
}

float head(vec3 p) {
  vec3 m = vec3(abs(p.x), p.yz);

  // Skull, face and jaw
  float d = sdEllipsoid(p - vec3(0.0, 0.14, -0.06), vec3(0.39, 0.45, 0.49));
  d = smin(d, sdEllipsoid(p - vec3(0.0, -0.1, 0.11), vec3(0.3, 0.42, 0.35)), 0.18);
  d = smin(d, sdEllipsoid(p - vec3(0.0, -0.42, 0.17), vec3(0.16, 0.12, 0.15)), 0.12);
  d = smin(d, sdEllipsoid(m - vec3(0.16, -0.07, 0.28), vec3(0.11, 0.08, 0.09)), 0.08);

  // Brow, sockets and eyes
  d = smin(d, sdCapsule(m, vec3(0.02, 0.06, 0.4), vec3(0.2, 0.075, 0.33), 0.045), 0.06);
  d = smax(d, -sdEllipsoid(m - vec3(0.125, -0.005, 0.425), vec3(0.08, 0.045, 0.05)), 0.03);
  d = smin(d, sdEllipsoid(m - vec3(0.125, -0.012, 0.372), vec3(0.058, 0.038, 0.05)), 0.015);
  d = smin(d, sdCapsule(m, vec3(0.07, 0.022, 0.405), vec3(0.18, 0.018, 0.385), 0.016), 0.02);

  // Nose
  // A Greek profile: the nose runs straight on from the brow.
  d = smin(d, sdCapsule(p, vec3(0.0, 0.08, 0.425), vec3(0.0, -0.17, 0.52), 0.036), 0.06);
  d = smin(d, sdEllipsoid(m - vec3(0.035, -0.18, 0.47), vec3(0.042, 0.03, 0.035)), 0.03);

  // Lips
  d = smin(d, sdEllipsoid(p - vec3(0.0, -0.272, 0.415), vec3(0.068, 0.02, 0.032)), 0.03);
  d = smin(d, sdEllipsoid(p - vec3(0.0, -0.312, 0.405), vec3(0.058, 0.021, 0.03)), 0.03);
  d = smax(d, -sdEllipsoid(p - vec3(0.0, -0.292, 0.44), vec3(0.065, 0.005, 0.025)), 0.008);

  // Ears
  d = smin(d, sdEllipsoid(m - vec3(0.385, -0.04, -0.04), vec3(0.045, 0.11, 0.07)), 0.04);

  // Neck and draped shoulders
  d = smin(d, sdCapsule(p, vec3(0.0, -0.35, -0.1), vec3(0.0, -0.95, -0.06), 0.18), 0.14);
  float chest = sdEllipsoid(p - vec3(0.0, -1.28, -0.12), vec3(0.9, 0.42, 0.42));
  // Drapery: diagonal folds gathered toward one shoulder.
  float folds = sin(p.x * 9.0 + p.y * 6.0) + 0.5 * sin(p.x * 17.0 - p.y * 4.0 + 1.3);
  chest -= 0.03 * folds * smoothstep(-0.9, -1.2, p.y);
  d = smin(d, chest, 0.18);

  // Hair: a shell over the crown and back of the head, behind the hairline, knotted into curls
  float shell = sdEllipsoid(p - vec3(0.0, 0.17, -0.1), vec3(0.45, 0.5, 0.53));
  float hairline = dot(p - vec3(0.0, 0.17, 0.27), normalize(vec3(0.0, 0.62, -0.78)));
  float hair = smax(shell, -hairline, 0.06);
  hair = smax(hair, -(p.y + 0.3), 0.08);
  hair -= 0.06 * curls(p);
  d = smin(d, hair, 0.035);

  return d;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    head(p + e.xyy) - head(p - e.xyy),
    head(p + e.yxy) - head(p - e.yxy),
    head(p + e.yyx) - head(p - e.yyx)
  ));
}

float shadow(vec3 ro, vec3 rd) {
  float res = 1.0;
  float t = 0.02;
  for (int i = 0; i < 28; i++) {
    float h = head(ro + rd * t);
    res = min(res, 10.0 * h / t);
    t += clamp(h, 0.02, 0.2);
    if (res < 0.01 || t > 3.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

float occlusion(vec3 p, vec3 n) {
  float o = 0.0;
  for (int i = 1; i <= 5; i++) {
    float h = 0.03 * float(i);
    o += (h - head(p + n * h)) / float(i);
  }
  return clamp(1.0 - 4.0 * o, 0.0, 1.0);
}

// Light reaching the camera at this pixel, 0 (graphite) to 1 (lit marble).
float render(vec2 frag) {
  vec2 uv = (frag - 0.5 * uResolution) / min(uResolution.x, uResolution.y * 0.78);
  vec3 ro = vec3(0.0, -0.4, 4.5);
  vec3 rd = normalize(vec3(uv, -2.9));

  // Pose: the head turns three-quarters and lifts its gaze.
  mat3 pose = rotateY(uYaw) * rotateX(0.38);
  ro = pose * (ro - vec3(0.0, -0.35, 0.0));
  rd = pose * rd;

  float t = 0.0;
  bool hit = false;
  for (int i = 0; i < 96; i++) {
    float h = head(ro + rd * t);
    if (h < 0.001) { hit = true; break; }
    t += h * 0.9;
    if (t > 7.0) break;
  }
  if (!hit) return 0.0;

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 light = pose * normalize(vec3(sin(uLight), 0.75, cos(uLight)));
  float diffuse = clamp(dot(n, light), 0.0, 1.0);
  float wrap = clamp((dot(n, light) + 0.25) / 1.25, 0.0, 1.0);
  float shade = mix(diffuse, wrap, 0.25) * shadow(p + n * 0.01, light);
  float ao = occlusion(p, n);
  float rim = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0) * 0.12;
  // Chiaroscuro: the light is held on the head and falls away down the drapery.
  vec3 local = p * pose;
  float fall = mix(0.4, 1.0, smoothstep(-1.2, -0.45, local.y));
  return clamp(((shade * 0.95 + 0.04) * ao + rim) * fall, 0.0, 1.0);
}

float bayer2(vec2 a) {
  a = floor(a);
  return fract(dot(a, vec2(0.5, a.y * 0.75)));
}
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float noise(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void main() {
  // Below the scan line the form stays in continuous tone, at full resolution.
  if (1.0 - gl_FragCoord.y / uResolution.y > uScan) {
    float tone = pow(render(gl_FragCoord.xy) * uExposure, 0.85);
    outColor = vec4(mix(uGround, uTone, tone), 1.0);
    return;
  }

  float block = max(1.0, floor(uBlock));
  vec2 cell = floor(gl_FragCoord.xy / block);
  float tone = pow(render((cell + 0.5) * block) * uExposure, 0.85);

  vec2 q = cell + uPhase;
  float threshold = mix(bayer8(q), noise(q), uPattern);
  float level = clamp(floor(tone * 2.0 + threshold), 0.0, 2.0);
  vec3 ink = level < 0.5 ? uGround : level < 1.5 ? uMid : uHigh;
  outColor = vec4(ink, 1.0);
}
`;
