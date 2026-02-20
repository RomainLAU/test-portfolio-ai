#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouseTrailPoints[32];
uniform float mouseTrailAges[32];   

out vec4 fragColor;

// --- Simplex Noise internal helpers (staying concise for stability) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.853373771369537 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// --- End of Simplex Noise internal helpers ---

vec3 getPaletteColor(float noiseIntensity) {
  vec3 mintColor      = vec3(0.165, 0.671, 0.478); // #2aab7a
  vec3 coralColor     = vec3(0.788, 0.271, 0.271); // #c94545
  vec3 pervencheColor = vec3(0.494, 0.498, 0.859); // #7e7fdb
  vec3 backgroundColor= vec3(0.067, 0.067, 0.067); // #111111 (Le fond très sombre)
  
  // smoothstep(min, max, value) permet de créer des zones de transition
  float mintFactor      = smoothstep(0.0, 0.5, noiseIntensity);
  float coralFactor     = smoothstep(0.3, 0.8, noiseIntensity);
  float pervencheFactor = smoothstep(0.6, 1.0, noiseIntensity);
  
  // On mélange les couleurs une à une sur le fond sombre
  vec3 finalColor = backgroundColor;
  finalColor = mix(finalColor, mintColor, mintFactor * 0.8);
  finalColor = mix(finalColor, coralColor, coralFactor * 0.6);
  finalColor = mix(finalColor, pervencheColor, pervencheFactor * 0.7);
  
  return finalColor;
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / resolution.xy;
  float aspectRatio = resolution.x / resolution.y;
  vec2 correctedUV = vec2(screenUV.x * aspectRatio, screenUV.y);

  float animatedTime = time * 0.4;

  vec2 waveDistortion = vec2(0.0);
  float shadowTrailIntensity = 0.0;

  for(int i = 0; i < 32; i++) {
    vec2 pointPosition = vec2(mouseTrailPoints[i].x * aspectRatio, 1.0 - mouseTrailPoints[i].y);
    float distanceToPoint = length(correctedUV - pointPosition);
    float pointAge = mouseTrailAges[i];
    
    // Distorsion des vagues
    float pushStrength = exp(-distanceToPoint * 10.0) * pointAge;
    vec2 pushDir = normalize(correctedUV - pointPosition + 0.0001);
    waveDistortion += pushDir * pushStrength * 0.06;
    
    // Le "Trou Noir" (Shadow Void)
    // On augmente le multiplier à 35.0 pour un trou plus net et petit
    shadowTrailIntensity += exp(-distanceToPoint * 30.0) * pointAge;
  }
  
  vec2 distortedCoords = correctedUV + waveDistortion;
  
  // Couches de bruit
  float noise1 = snoise(vec3(distortedCoords * 1.2, animatedTime * 0.5)) * 0.5 + 0.5;
  float noise2 = snoise(vec3(distortedCoords * 2.5 + 10.0, animatedTime * 0.4)) * 0.5 + 0.5;
  float noiseValue = mix(noise1, noise2, 0.9);

  vec3 pixelColor = getPaletteColor(noiseValue);

  // Application du Shadow Void (on force le mélange vers le noir pur)
  vec3 blackVoid = vec3(0.03, 0.03, 0.03); 
  pixelColor = mix(pixelColor, blackVoid, clamp(shadowTrailIntensity, 0.0, 1.0));

  // Vignette
  float vignette = 1.0 - smoothstep(0.2, 1.5, length(screenUV - 0.5) * 1.5);
  pixelColor *= vignette;
  
  // Boost final
  pixelColor *= 1.1;

  fragColor = vec4(pixelColor, 1.0);
}
