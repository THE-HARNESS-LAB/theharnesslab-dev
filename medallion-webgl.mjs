// Client-only WebGL2 raymarched solid bronze medallion for theharnesslab.dev.
// Driven directly by the quaternion bearing-spin physics in engineering.mjs.
//
// Front (+Z): dark marble & gold circuit engineering seal (theharnesslab.dev).
// Back  (-Z): warm bronze & ivory studio seal (theharnesslab.com).
// Rim       : solid numismatic thickness (HALF_T = 0.145) with 144 machined
//             reeds, twin 24k gold guard fillets, and 3D V-cut edge lettering.

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform mat3 uCoinToWorld;
uniform float uBob;
uniform float uPop;
uniform float uEdge;
uniform int uSteps;
uniform int uShadowSteps;
uniform int uValidate;

uniform sampler2D uObvAlb;
uniform sampler2D uObvHgt; // R: relief height, G: 2D silhouette SDF, B: specular mask
uniform sampler2D uObvEmi;
uniform sampler2D uRevAlb;
uniform sampler2D uRevHgt;
uniform sampler2D uRevEmi;
uniform sampler2D uEdgeTex; // R: V-groove depth, G: crisp glyph mask, B: bevel highlight

// Exact physical coin proportions matching theharnesslab.com (HALF_T = 0.145, R = 1.602).
// CAM.z = 5.15 keeps the entire 3D bounding sphere (including protruding wing tips)
// cleanly inside [-0.495, +0.495] at every possible free-axis quaternion tumble angle.
const float R = 1.602;
const float UV_RIM = 0.455;
const float UV_SPAN = R / UV_RIM;
const float HALF_T = 0.145;
const float BOUND_R = 1.82;
const float BOUND_Z = HALF_T + 0.15;
const float FOCAL = 1.35;
const vec3 CAM = vec3(0.0, 0.0, 5.15);
const float FLOOR_Y = -1.86;
const float DISC_R = 1.55;
const float EPS = 0.0008;
const float ALB_SIZE = 1024.0;

float gauss(float x) { return exp(-(x * x)); }

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Sample cylindrical rim engraving (4 quadrants around circumference: -90, 0, +90, 180 deg).
vec3 sampleEdgeEngraving(vec3 p, float lod) {
  float ang = atan(p.y, p.x);
  float u = fract((ang / 1.57079632679) + 0.5);
  float v = clamp((p.z / 0.104) * 0.5 + 0.5, 0.0, 1.0);
  float band = 1.0 - smoothstep(0.097, 0.105, abs(p.z));
  return textureLod(uEdgeTex, vec2(u, v), lod).rgb * band;
}

float sdCappedCyl(vec3 p, float rad, float halfH) {
  vec2 d = vec2(length(p.xy) - rad, abs(p.z) - halfH);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

// Signed distance to the sculpted thick bronze coin + protruding 3D wing tips.
float mapCoin(vec3 p) {
  float r = length(p.xy);
  float az = abs(p.z);

  if (r > 1.79 || az > HALF_T + 0.14) {
    return sdCappedCyl(p, 1.765, HALF_T + 0.115);
  }

  vec2 uv = clamp(p.xy / UV_SPAN + 0.5, 0.001, 0.999);
  vec2 buv = vec2(1.0 - uv.x, uv.y);

  vec3 hF = textureLod(uObvHgt, uv, 0.5).rgb;
  vec3 hB = textureLod(uRevHgt, buv, 0.5).rgb;

  float dispF = (hF.r - 0.32) * 0.082 * uPop;
  float dispB = (hB.r - 0.32) * 0.082 * uPop;

  float disp = 0.0;
  if (r <= R) {
    float taper = 1.0 - smoothstep(R - 0.042, R, r);
    disp = (p.z >= 0.0 ? dispF : dispB) * taper;
  }

  // Numismatic rim: outer 144-reed collars, twin gold guard fillets, and 3D V-cut inscription.
  float ang = atan(p.y, p.x);
  float reedBand = smoothstep(0.107, 0.115, az) * (1.0 - smoothstep(HALF_T - 0.015, HALF_T - 0.004, az));
  float reeds = sin(ang * 144.0) * 0.0065 * reedBand;
  float wireRings = gauss((az - 0.104) / 0.0042) * 0.0065;
  float engraveCut = 0.0;
  if (r > R - 0.045 && az < 0.104) {
    engraveCut = -sampleEdgeEngraving(p, 0.5).r * 0.0105;
  }

  float effR = R + reeds + wireRings + engraveCut;
  vec2 qCoin = vec2(r - effR, az - (HALF_T + disp));
  float d = min(max(qCoin.x, qCoin.y), 0.0) + length(max(qCoin, 0.0)) - 0.013;

  // Protruding 3D carved wing tips gated by true 3D facing cosine (uCoinToWorld[2].z)
  // so arbitrary diagonal / pitch / roll tumbles never poke a mirrored silhouette from behind.
  if (r > R - 0.045) {
    float faceCos = uCoinToWorld[2].z;
    float frontVis = smoothstep(-0.05, 0.42, faceCos);
    float backVis  = smoothstep(-0.05, 0.42, -faceCos);
    float tipTaper = 1.0 - smoothstep(R, R * 1.09, r) * 0.55;

    if (frontVis > 0.01 && hF.g > 0.12) {
      float dSilF = ((0.5 - hF.g) / 14.0) * UV_SPAN + (1.0 - frontVis) * 0.12;
      float zMidF = HALF_T + dispF * 0.42;
      float zHalfF = 0.016 * tipTaper;
      vec2 qWF = vec2(dSilF, abs(p.z - zMidF) - zHalfF);
      float dWF = min(max(qWF.x, qWF.y), 0.0) + length(max(qWF, 0.0)) - 0.005;
      d = smin(d, dWF, 0.007);
    }
    if (backVis > 0.01 && hB.g > 0.12) {
      float dSilB = ((0.5 - hB.g) / 14.0) * UV_SPAN + (1.0 - backVis) * 0.12;
      float zMidB = -(HALF_T + dispB * 0.42);
      float zHalfB = 0.016 * tipTaper;
      vec2 qWB = vec2(dSilB, abs(p.z - zMidB) - zHalfB);
      float dWB = min(max(qWB.x, qWB.y), 0.0) + length(max(qWB, 0.0)) - 0.005;
      d = smin(d, dWB, 0.007);
    }
  }

  return d;
}

vec3 calcNormal(vec3 p) {
  const float h = 0.0026;
  const vec2 k = vec2(1.0, -1.0);
  return normalize(
    k.xyy * mapCoin(p + k.xyy * h) +
    k.yyx * mapCoin(p + k.yyx * h) +
    k.yxy * mapCoin(p + k.yxy * h) +
    k.xxx * mapCoin(p + k.xxx * h));
}

float softShadow(vec3 ro, vec3 rd) {
  float res = 1.0;
  float t = 0.022;
  for (int i = 0; i < 18; i++) {
    if (i >= uShadowSteps) break;
    float h = mapCoin(ro + rd * t);
    res = min(res, 10.0 * h / t);
    t += clamp(h, 0.014, 0.06);
    if (res < 0.08 || t > 0.65) break;
  }
  return clamp(res, 0.22, 1.0);
}

vec3 studioEnv(vec3 dir) {
  float v = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(vec3(0.02, 0.018, 0.016), vec3(0.075, 0.064, 0.052), gauss((v - 0.5) / 0.16));
  col += vec3(1.65, 1.28, 0.88) * pow(max(0.0, dot(dir, normalize(vec3(-0.35, 0.82, 0.45)))), 7.0);
  col += vec3(1.45, 0.86, 0.44) * pow(max(0.0, dot(dir, normalize(vec3(0.82, 0.18, 0.54)))), 14.0);
  col += vec3(0.62, 0.84, 1.10) * pow(max(0.0, dot(dir, normalize(vec3(-0.85, 0.28, -0.45)))), 10.0);
  col += vec3(0.95, 0.46, 0.14) * pow(max(0.0, dot(dir, normalize(vec3(0.1, -0.78, 0.60)))), 8.0);
  return col;
}

vec3 acesTonemap(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

vec3 shadeCoin(vec3 p, vec3 nLocal, mat3 coinToWorld, vec3 rdWorld, float t) {
  float r = length(p.xy);
  float az = abs(p.z);
  vec2 uv = clamp(p.xy / UV_SPAN + 0.5, 0.001, 0.999);
  vec2 buv = vec2(1.0 - uv.x, uv.y);

  vec3 N = normalize(coinToWorld * nLocal);
  vec3 V = -rdWorld;
  float NoV = max(dot(N, V), 0.001);
  vec3 Rdir = reflect(-V, N);

  vec3 L1 = normalize(vec3(-0.52, 0.64, 0.56));
  vec3 L2 = normalize(vec3(0.72, 0.35, -0.60));
  vec3 L3 = normalize(vec3(sin(uTime * 1.05) * 0.58, -0.48, 0.66));

  float footprint = t / (uRes.y * FOCAL);
  float texels = footprint / UV_SPAN * ALB_SIZE / max(NoV, 0.25);
  float lodA = max(log2(max(texels, 1e-4)), 0.0);
  float lodE = max(lodA - 0.5, 0.0);

  vec2 fuv = p.z >= 0.0 ? uv : buv;
  vec3 hData = p.z >= 0.0 ? textureLod(uObvHgt, fuv, 0.5).rgb : textureLod(uRevHgt, fuv, 0.5).rgb;

  float inWingTip = smoothstep(0.42, 0.52, hData.g) * smoothstep(R - 0.015, R + 0.006, r) * smoothstep(HALF_T - 0.032, HALF_T - 0.010, az);
  float inCoinFace = (1.0 - smoothstep(R - 0.026, R - 0.011, r)) * smoothstep(HALF_T - 0.016, HALF_T - 0.004, az);
  float faceMask = clamp(max(inCoinFace, inWingTip), 0.0, 1.0);

  // Machined numismatic bronze rim + 24k gold V-cut edge inscription (HDR -> ACES).
  vec3 edgeLinear = vec3(0.0);
  if (faceMask < 0.999) {
    float ang = atan(p.y, p.x);
    vec3 eng = az < 0.105 ? sampleEdgeEngraving(p, 0.0) : vec3(0.0);
    float inBand = 1.0 - smoothstep(0.100, 0.107, az);
    float guardRail = gauss((az - 0.104) / 0.0045);

    vec3 bandAlb = vec3(0.30, 0.17, 0.075);
    vec3 collarAlb = vec3(0.78, 0.49, 0.21);
    vec3 eAlb = mix(collarAlb, bandAlb, inBand);
    eAlb = mix(eAlb, vec3(0.96, 0.74, 0.32), clamp(guardRail * 0.85, 0.0, 1.0));

    float eMetal = mix(0.96, 0.88, inBand);
    float eRough = mix(0.14, 0.27, inBand);

    float strokeMask = smoothstep(0.22, 0.72, eng.g);
    float bevelRim = clamp(eng.b * 1.15, 0.0, 1.0);
    eAlb = mix(eAlb, vec3(0.06, 0.035, 0.015), clamp(bevelRim * 0.65, 0.0, 1.0));
    eAlb = mix(eAlb, vec3(1.0, 0.80, 0.36), strokeMask);
    eMetal = mix(eMetal, 0.99, strokeMask);
    eRough = mix(eRough, 0.11, strokeMask);

    float sweep = 0.32 + 0.30 * (0.5 + 0.5 * sin(ang * 2.0 - uTime * 1.7));
    vec3 eEmiss = vec3(1.05, 0.74, 0.26) * strokeMask * sweep * uEdge;

    vec3 F0 = mix(vec3(0.04), eAlb, eMetal);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - NoV, 5.0);
    float specPow = mix(180.0, 14.0, eRough * eRough);
    vec3 envS = studioEnv(Rdir) * mix(1.30, 0.52, eRough) * F;
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    vec3 H3 = normalize(L3 + V);
    vec3 d1 = F * pow(max(dot(N, H1), 0.0), specPow) * 1.85 * vec3(2.4, 2.05, 1.65) * max(dot(N, L1), 0.0);
    vec3 d2 = F * pow(max(dot(N, H2), 0.0), specPow * 0.7) * 1.35 * vec3(0.95, 1.20, 1.45) * max(dot(N, L2), 0.0);
    vec3 d3 = F * pow(max(dot(N, H3), 0.0), specPow * 1.1) * vec3(1.65, 1.10, 0.55) * max(dot(N, L3), 0.0);
    vec3 amb = vec3(0.14, 0.10, 0.06) * eAlb;
    edgeLinear = acesTonemap(amb + envS + d1 + d2 + d3 + eEmiss);
  }

  if (faceMask <= 0.001) {
    return edgeLinear;
  }

  vec3 texSrgb = p.z >= 0.0 ? textureLod(uObvAlb, uv, lodA).rgb : textureLod(uRevAlb, buv, lodA).rgb;
  vec3 emiSrgb = p.z >= 0.0 ? textureLod(uObvEmi, uv, lodE).rgb : textureLod(uRevEmi, buv, lodE).rgb;
  vec3 baseLin = pow(texSrgb, vec3(2.2));
  vec3 emissLin = pow(emiSrgb, vec3(2.0));

  float specMask = hData.b;

  vec3 L1Local = normalize(transpose(coinToWorld) * L1);
  float sh = softShadow(p + nLocal * 0.005, L1Local);

  vec3 faceWorld = normalize(coinToWorld * vec3(0.0, 0.0, p.z >= 0.0 ? 1.0 : -1.0));
  float flatL1 = max(dot(vec3(0.0, 0.0, 1.0), L1), 0.35);
  float curL1 = max((dot(N, L1) + 0.38) / 1.38, 0.0) * mix(0.76, 1.0, sh);
  float reliefRatio = clamp(curL1 / (flatL1 * 0.92), 0.52, 1.24);
  float turnAmt = clamp((1.0 - abs(faceWorld.z)) * 1.65 + 0.26, 0.26, 1.0);
  float shadeMult = mix(1.0, reliefRatio, turnAmt);

  vec3 specTint = mix(vec3(0.95, 0.93, 0.90), max(baseLin * 1.65, vec3(0.72, 0.46, 0.20)), smoothstep(0.22, 0.65, specMask));
  float specPow = mix(42.0, 115.0, smoothstep(0.25, 0.85, specMask));
  vec3 F0 = mix(vec3(0.035), specTint * 0.55, smoothstep(0.22, 0.80, specMask));
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - NoV, 5.0);

  vec3 H1 = normalize(L1 + V);
  vec3 H2 = normalize(L2 + V);
  vec3 H3 = normalize(L3 + V);

  float facetTilt = clamp(length(nLocal.xy) * 1.45 + (1.0 - abs(faceWorld.z)) * 1.2, 0.08, 1.0);
  vec3 specAdd = specMask * (
    studioEnv(Rdir) * F * (0.28 + 0.55 * (1.0 - abs(faceWorld.z))) +
    specTint * pow(max(dot(N, H1), 0.0), specPow) * 0.42 * sh * facetTilt +
    vec3(0.75, 0.92, 1.12) * F * pow(max(dot(N, H2), 0.0), specPow * 0.65) * 0.55 * max(dot(N, L2), 0.0) +
    specTint * pow(max(dot(N, H3), 0.0), specPow * 0.9) * 0.52 * max(dot(N, L3), 0.0) * facetTilt
  );
  specAdd = specAdd / (1.0 + 0.85 * specAdd);

  float emiPulse = 0.22 + 0.16 * (0.5 + 0.5 * sin(uTime * 1.8));
  vec3 faceLinear = clamp(baseLin * shadeMult + specAdd + emissLin * emiPulse * uPop, 0.0, 1.0);

  return mix(edgeLinear, faceLinear, faceMask);
}

bool boundCoin(vec3 ro, vec3 rd, out float t0, out float t1) {
  float tc0 = -1e6, tc1 = 1e6;
  float a = dot(rd.xy, rd.xy);
  float c = dot(ro.xy, ro.xy) - BOUND_R * BOUND_R;
  if (a > 1e-8) {
    float b = dot(ro.xy, rd.xy);
    float h = b * b - a * c;
    if (h < 0.0) return false;
    h = sqrt(h);
    tc0 = (-b - h) / a;
    tc1 = (-b + h) / a;
  } else if (c > 0.0) {
    return false;
  }
  float tz0 = -1e6, tz1 = 1e6;
  if (abs(rd.z) > 1e-8) {
    float ta = (-BOUND_Z - ro.z) / rd.z;
    float tb = (BOUND_Z - ro.z) / rd.z;
    tz0 = min(ta, tb);
    tz1 = max(ta, tb);
  } else if (abs(ro.z) > BOUND_Z) {
    return false;
  }
  t0 = max(max(tc0, tz0), 0.0);
  t1 = min(tc1, tz1);
  return t1 > t0;
}

bool marchCoin(vec3 ro, vec3 rd, out float tHit, out float minRatio, out float tMin) {
  tHit = 0.0;
  minRatio = 1e6;
  tMin = 0.0;
  float t0, t1;
  if (!boundCoin(ro, rd, t0, t1)) return false;
  float t = t0;
  float tPrev = t0;
  for (int i = 0; i < 128; i++) {
    if (i >= uSteps) break;
    float d = mapCoin(ro + rd * t);
    float ratio = d / max(t, 1e-3);
    if (ratio < minRatio) { minRatio = ratio; tMin = t; }
    if (d < EPS) {
      float lo = tPrev, hi = t;
      for (int k = 0; k < 4; k++) {
        float m = 0.5 * (lo + hi);
        if (mapCoin(ro + rd * m) > EPS) lo = m; else hi = m;
      }
      tHit = hi;
      return true;
    }
    tPrev = t;
    t += d * 0.5;
    if (t > t1) break;
  }
  return false;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 rd = normalize(vec3(uv, -FOCAL));
  float pixAng = 1.0 / (uRes.y * FOCAL);

  mat3 coinToWorld = uCoinToWorld;
  mat3 worldToCoin = transpose(coinToWorld);
  vec3 coinCenter = vec3(0.0, uBob, 0.0);

  vec3 roL = worldToCoin * (CAM - coinCenter);
  vec3 rdL = worldToCoin * rd;

  float tHit, minRatio, tMin;
  bool hit = marchCoin(roL, rdL, tHit, minRatio, tMin);

  float cov = 0.0;
  vec3 col = vec3(0.0);
  if (hit) {
    vec3 pL = roL + rdL * tHit;
    col = shadeCoin(pL, calcNormal(pL), coinToWorld, rd, tHit);
    cov = 1.0;
  } else {
    cov = clamp(1.0 - minRatio / pixAng, 0.0, 1.0);
    if (cov > 0.0) {
      vec3 pL = roL + rdL * tMin;
      col = shadeCoin(pL, calcNormal(pL), coinToWorld, rd, tMin);
    }
  }

  col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
  vec4 coin = vec4(col * cov, cov);

  vec4 disc = vec4(0.0);
  if (cov < 1.0 && rd.y < -0.01) {
    float tf = (FLOOR_Y - CAM.y) / rd.y;
    vec3 pf = CAM + rd * tf;
    float dr = length(pf.xz) / DISC_R;
    vec2 s = gl_FragCoord.xy / uRes;
    float edge = smoothstep(0.0, 0.12, s.y) * smoothstep(0.0, 0.12, s.x) * smoothstep(0.0, 0.12, 1.0 - s.x);
    float a = 0.52 * (1.0 - smoothstep(0.1, 1.0, dr)) * edge;
    disc = vec4(vec3(0.010, 0.007, 0.005) * a, a);
  }

  fragColor = coin + disc * (1.0 - coin.a);
  if (uValidate == 1 && fragColor.a < 0.785) discard;
}
`;

const TEXTURES = [
  ['uObvAlb', '/assets/medallion/dev-front-alb.webp'],
  ['uObvHgt', '/assets/medallion/dev-front-hgt.webp'],
  ['uObvEmi', '/assets/medallion/dev-front-emi.webp'],
  ['uRevAlb', '/assets/medallion/dev-back-alb.webp'],
  ['uRevHgt', '/assets/medallion/dev-back-hgt.webp'],
  ['uRevEmi', '/assets/medallion/dev-back-emi.webp'],
];

const HW_TIERS = [
  { steps: 128, shadow: 18, scale: 1.0 },
  { steps: 96, shadow: 12, scale: 0.85 },
  { steps: 72, shadow: 8, scale: 0.7 },
];

// Fast software-renderer tier so headless CI / CPU WebGL2 renders the full
// thick coin smoothly without starving bearing-spin frame timing.
const SW_TIERS = [
  { steps: 64, shadow: 6, scale: 0.45 },
  { steps: 48, shadow: 4, scale: 0.35 },
];

const DPR_CAP = 2;

async function buildEdgeEngravingBitmap() {
  try {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 900)),
      ]);
    }
  } catch {
    // Proceed with serif fallback if font loading rejects.
  }

  const W = 2048;
  const H = 256;
  const VW = 3020;
  const VH = 256;

  const drawGlyphs = (blurPx) => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.scale(W / VW, 1);
    if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 2.4;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.lineTo(VW, 22);
    ctx.moveTo(0, VH - 22);
    ctx.lineTo(VW, VH - 22);
    ctx.stroke();

    ctx.globalAlpha = 0.9;
    ctx.font = '700 42px "Cinzel", Georgia, serif';
    ctx.fillText('✦', 0, VH * 0.5);
    ctx.fillText('✦', VW, VH * 0.5);

    ctx.globalAlpha = 1;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4.8px';
    ctx.font = '800 58px "Cinzel", Georgia, serif';
    ctx.fillText(
      'SPENCER ALLEN TEAGUE · STARTED THE JOURNEY IN 2020',
      VW * 0.5,
      94,
    );

    if ('letterSpacing' in ctx) ctx.letterSpacing = '5.8px';
    ctx.font = '700 52px "Cinzel", Georgia, serif';
    ctx.fillText(
      'AND FOUNDED THE HARNESS LAB IN 2026',
      VW * 0.5,
      170,
    );
    ctx.restore();
    return ctx.getImageData(0, 0, W, H);
  };

  const sharp = drawGlyphs(0);
  const soft = drawGlyphs(3.2);
  const out = new ImageData(W, H);
  const sd = sharp.data;
  const bd = soft.data;
  const od = out.data;
  for (let i = 0; i < sd.length; i += 4) {
    const s = sd[i];
    const b = bd[i];
    od[i] = Math.min(255, Math.round(b * 0.62 + s * 0.48));
    od[i + 1] = s;
    od[i + 2] = Math.min(255, Math.max(0, Math.round(Math.abs(b - s) * 2.1)));
    od[i + 3] = 255;
  }

  return createImageBitmap(out, {
    imageOrientation: 'flipY',
    premultiplyAlpha: 'none',
    colorSpaceConversion: 'none',
  });
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function isSoftwareRenderer(gl) {
  try {
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(
      (dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '') ||
        gl.getParameter(gl.RENDERER) ||
        '',
    );
    return /SwiftShader|llvmpipe|SoftPipe|Software|Microsoft Basic Render/i.test(name);
  } catch {
    return false;
  }
}

/**
 * Mount a WebGL2 raymarched solid bronze coin onto `canvas`, driven by an
 * external column-major 3x3 world-space rotation matrix (`Float32Array(9)`).
 */
export function createMedallionWebGL(
  canvas,
  { initialMatrix, onReady, onFail } = {},
) {
  let disposed = false;
  let failed = false;
  let ready = false;
  let visible = true;
  let docHidden = document.hidden;
  let reducedMotion = false;
  let externallyDriven = false;

  let mat3 = initialMatrix ? new Float32Array(initialMatrix) : new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]);
  let idleRaf = 0;
  let demandRaf = 0;
  let lastIdleTs = 0;
  let shaderTime = 0;
  let bobBlend = 1;

  let cssW = 0;
  let cssH = 0;
  let bufW = 0;
  let bufH = 0;
  let tier = 0;
  let tiers = HW_TIERS;
  const perf = { ema: 0, slow: 0, warm: 20 };

  let gl = null;
  let program = null;
  let vao = null;
  let buffer = null;
  const textures = [];
  let uniforms = {};
  const abort = new AbortController();
  let resizeObserver = null;
  let intersectionObserver = null;

  function fail(reason) {
    if (failed || disposed) return;
    failed = true;
    stopIdleLoop();
    queueMicrotask(() => {
      if (!disposed) onFail?.(reason);
    });
  }

  const onContextLost = (e) => {
    e.preventDefault();
    fail('context-lost');
  };

  const onVisibility = () => {
    docHidden = document.hidden;
    syncIdleLoop();
  };

  gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: true,
  });

  if (!gl || typeof createImageBitmap !== 'function') {
    fail('unsupported');
    return makeApi();
  }

  if (isSoftwareRenderer(gl)) {
    tiers = SW_TIERS;
  }

  canvas.addEventListener('webglcontextlost', onContextLost);

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  const parallel = gl.getExtension('KHR_parallel_shader_compile');

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  measure();
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(([entry]) => {
      const box = entry.contentBoxSize?.[0];
      cssW = box ? box.inlineSize : entry.contentRect.width;
      cssH = box ? box.blockSize : entry.contentRect.height;
      if (applySize() && ready) requestRender();
    });
    resizeObserver.observe(canvas);
  }
  if (typeof IntersectionObserver === 'function') {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncIdleLoop();
    });
    intersectionObserver.observe(canvas);
  }
  document.addEventListener('visibilitychange', onVisibility);

  init();

  async function waitForProgram() {
    if (parallel) {
      while (!gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (disposed || failed) return false;
      }
    }
    return Boolean(gl.getProgramParameter(program, gl.LINK_STATUS));
  }

  async function decodeAll() {
    return Promise.all(
      TEXTURES.map(async ([, url]) => {
        const res = await fetch(url, { signal: abort.signal, credentials: 'same-origin' });
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        const blob = await res.blob();
        return createImageBitmap(blob, {
          imageOrientation: 'flipY',
          premultiplyAlpha: 'none',
          colorSpaceConversion: 'none',
        });
      }),
    );
  }

  async function init() {
    let bitmaps = null;
    let edgeBitmap = null;
    try {
      const [linked, decoded, edgeBmp] = await Promise.all([
        waitForProgram(),
        decodeAll(),
        buildEdgeEngravingBitmap(),
      ]);
      bitmaps = decoded;
      edgeBitmap = edgeBmp;
      if (disposed || failed) return;
      if (!linked) return fail('compile');

      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.useProgram(program);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.bindVertexArray(vao);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      uniforms = {};
      for (const name of [
        'uRes',
        'uTime',
        'uCoinToWorld',
        'uBob',
        'uPop',
        'uEdge',
        'uSteps',
        'uShadowSteps',
        'uValidate',
      ]) {
        uniforms[name] = gl.getUniformLocation(program, name);
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);

      TEXTURES.forEach(([name], i) => {
        const tex = gl.createTexture();
        textures.push(tex);
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bitmaps[i]);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, name), i);
      });

      const edgeUnit = TEXTURES.length;
      const edgeTex = gl.createTexture();
      textures.push(edgeTex);
      gl.activeTexture(gl.TEXTURE0 + edgeUnit);
      gl.bindTexture(gl.TEXTURE_2D, edgeTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, edgeBitmap);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, 'uEdgeTex'), edgeUnit);

      if (gl.getError() !== gl.NO_ERROR) return fail('texture');

      gl.uniform1f(uniforms.uPop, 1);
      gl.uniform1f(uniforms.uEdge, 1);
      applyTier();

      await firstFrame();
    } catch {
      if (!disposed) fail('texture');
    } finally {
      bitmaps?.forEach((b) => b.close());
      edgeBitmap?.close();
    }
  }

  async function firstFrame() {
    while (!applySize() && (bufW === 0 || bufH === 0)) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (disposed || failed) return;
      measure();
    }
    draw();
    if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) {
      return fail('invalid-frame');
    }
    const query = gl.createQuery();
    let passed = false;
    try {
      if (!query) return fail('invalid-frame');
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(bufW >> 1, bufH >> 1, 1, 1);
      gl.colorMask(false, false, false, false);
      gl.uniform1i(uniforms.uValidate, 1);
      gl.beginQuery(gl.ANY_SAMPLES_PASSED, query);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.endQuery(gl.ANY_SAMPLES_PASSED);
      gl.uniform1i(uniforms.uValidate, 0);
      gl.colorMask(true, true, true, true);
      gl.disable(gl.SCISSOR_TEST);
      gl.flush();

      let frames = 0;
      while (frames < 120) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (disposed || failed || gl.isContextLost()) return;
        if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
          passed = Boolean(gl.getQueryParameter(query, gl.QUERY_RESULT));
          break;
        }
        frames += 1;
      }
    } finally {
      if (gl && !gl.isContextLost() && query) {
        gl.deleteQuery(query);
      }
    }
    if (gl.getError() !== gl.NO_ERROR || gl.isContextLost() || !passed) {
      return fail('invalid-frame');
    }
    ready = true;
    onReady?.();
    draw();
    syncIdleLoop();
  }

  function measure() {
    const rect = canvas.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
  }

  function applySize() {
    if (!gl || failed || disposed) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP) * tiers[tier].scale;
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));
    if (cssW === 0 || cssH === 0) return false;
    if (w === bufW && h === bufH) return false;
    bufW = canvas.width = w;
    bufH = canvas.height = h;
    return true;
  }

  function applyTier() {
    gl.uniform1i(uniforms.uSteps, tiers[tier].steps);
    gl.uniform1i(uniforms.uShadowSteps, tiers[tier].shadow);
  }

  function trackPerf(dtMs) {
    if (perf.warm > 0) {
      perf.warm -= 1;
      return;
    }
    perf.ema = perf.ema ? perf.ema + (dtMs - perf.ema) * 0.12 : dtMs;
    if (perf.ema > 28) {
      perf.slow += 1;
      if (perf.slow > 24 && tier < tiers.length - 1) {
        tier += 1;
        applyTier();
        applySize();
        perf.slow = 0;
        perf.ema = 0;
        perf.warm = 15;
      }
    } else {
      perf.slow = Math.max(0, perf.slow - 1);
    }
  }

  function draw() {
    if (!gl || failed || disposed || bufW === 0) return;
    gl.viewport(0, 0, bufW, bufH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.uRes, bufW, bufH);
    gl.uniform1f(uniforms.uTime, shaderTime);
    gl.uniformMatrix3fv(uniforms.uCoinToWorld, false, mat3);
    const bob = reducedMotion ? 0 : Math.sin(shaderTime * 1.25) * 0.022 * bobBlend;
    gl.uniform1f(uniforms.uBob, bob);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function requestRender() {
    if (demandRaf || !ready || disposed || failed) return;
    demandRaf = requestAnimationFrame(() => {
      demandRaf = 0;
      draw();
    });
  }

  function stopIdleLoop() {
    if (idleRaf) {
      cancelAnimationFrame(idleRaf);
      idleRaf = 0;
    }
    lastIdleTs = 0;
  }

  function idleTick(ts) {
    idleRaf = 0;
    if (disposed || failed || !ready || externallyDriven || !visible || docHidden || reducedMotion) {
      return;
    }
    const dtMs = lastIdleTs ? Math.min(50, Math.max(1, ts - lastIdleTs)) : 16.67;
    lastIdleTs = ts;
    shaderTime += dtMs / 1000;
    bobBlend = Math.min(1, bobBlend + dtMs / 450);
    trackPerf(dtMs);
    draw();
    idleRaf = requestAnimationFrame(idleTick);
  }

  function syncIdleLoop() {
    if (ready && !disposed && !failed && !externallyDriven && visible && !docHidden && !reducedMotion) {
      if (!idleRaf) {
        lastIdleTs = 0;
        idleRaf = requestAnimationFrame(idleTick);
      }
    } else {
      stopIdleLoop();
    }
  }

  function makeApi() {
    return {
      setOrientation(nextMat3, active) {
        if (disposed || failed) return;
        mat3.set(nextMat3);
        const wasDriven = externallyDriven;
        externallyDriven = Boolean(active);
        if (externallyDriven) {
          stopIdleLoop();
          bobBlend = Math.max(0, bobBlend - 0.18);
          shaderTime += 1 / 60;
          if (ready) {
            const t0 = performance.now();
            draw();
            trackPerf(performance.now() - t0);
          }
        } else {
          if (ready) draw();
          if (wasDriven) syncIdleLoop();
        }
      },
      setReducedMotion(paused) {
        reducedMotion = Boolean(paused);
        syncIdleLoop();
        if (ready) requestRender();
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        abort.abort();
        stopIdleLoop();
        if (demandRaf) {
          cancelAnimationFrame(demandRaf);
          demandRaf = 0;
        }
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        if (gl && !gl.isContextLost()) {
          textures.forEach((t) => gl.deleteTexture(t));
          if (buffer) gl.deleteBuffer(buffer);
          if (vao) gl.deleteVertexArray(vao);
          if (program) gl.deleteProgram(program);
        }
        gl = null;
      },
    };
  }

  return makeApi();
}
