import { Geometry, Mesh, Program, Renderer, Vec3 } from 'ogl';
import { useEffect, useRef } from 'react';
import './Orb.css';

const vertex = /* glsl */ `
  precision highp float;
  attribute vec2 position, uv;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float iTime, hue, hover, hoverIntensity, rot;
  uniform vec3 iResolution, backgroundColor;
  varying vec2 vUv;

  vec3 rgb2yiq(vec3 c) { return vec3(dot(c,vec3(.299,.587,.114)),dot(c,vec3(.596,-.274,-.322)),dot(c,vec3(.211,-.523,.312))); }
  vec3 yiq2rgb(vec3 c) { return vec3(c.x+.956*c.y+.621*c.z,c.x-.272*c.y-.647*c.z,c.x-1.106*c.y+1.703*c.z); }
  vec3 hueShift(vec3 color, float degrees) {
    vec3 yiq=rgb2yiq(color); float a=degrees*3.14159265/180.; float co=cos(a), si=sin(a);
    float i=yiq.y*co-yiq.z*si; yiq.z=yiq.y*si+yiq.z*co; yiq.y=i; return yiq2rgb(yiq);
  }
  vec3 hash33(vec3 p) { p=fract(p*vec3(.1031,.11369,.13787)); p+=dot(p,p.yxz+19.19); return -1.+2.*fract(vec3(p.x+p.y,p.x+p.z,p.y+p.z)*p.zyx); }
  float noise(vec3 p) {
    const float K1=.333333333,K2=.166666667; vec3 i=floor(p+(p.x+p.y+p.z)*K1),d0=p-(i-(i.x+i.y+i.z)*K2);
    vec3 e=step(vec3(0.),d0-d0.yzx),i1=e*(1.-e.zxy),i2=1.-e.zxy*(1.-e); vec3 d1=d0-(i1-K2),d2=d0-(i2-K1),d3=d0-.5;
    vec4 h=max(.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.); vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.)));
    return dot(vec4(31.316),n);
  }
  vec4 alphaColor(vec3 c) { float a=max(max(c.r,c.g),c.b); return vec4(c/(a+.00001),a); }
  float light1(float intensity,float attenuation,float distance) { return intensity/(1.+distance*attenuation); }
  float light2(float intensity,float attenuation,float distance) { return intensity/(1.+distance*distance*attenuation); }
  vec4 draw(vec2 uv) {
    vec3 c1=hueShift(vec3(.611765,.262745,.996078),hue),c2=hueShift(vec3(.298039,.760784,.913725),hue),c3=hueShift(vec3(.062745,.078431,.6),hue);
    float angle=atan(uv.y,uv.x),len=length(uv),invLen=len>0.?1./len:0.,bg=dot(backgroundColor,vec3(.299,.587,.114));
    float n=noise(vec3(uv*.65,iTime*.5))*.5+.5,r=mix(.76,.84,n),d0=distance(uv,(r*invLen)*uv),v0=light1(1.,10.,d0);
    v0*=smoothstep(r*1.05,r,len); v0*=mix(smoothstep(r*.8,r*.95,len),1.,bg*.7);
    vec2 pos=vec2(cos(-iTime),sin(-iTime))*r; float d=distance(uv,pos),v1=light2(1.5,5.,d)*light1(1.,50.,d0);
    float v2=smoothstep(1.,mix(.6,1.,n*.5),len),v3=smoothstep(.6,mix(.6,1.,.5),len),cl=cos(angle+iTime*2.)*.5+.5;
    vec3 base=mix(c1,c2,cl),dark=clamp((mix(c3,base,v0)+v1)*v2*v3,0.,1.),light=clamp(mix(backgroundColor,(base+v1)*mix(1.,v2*v3,mix(1.,.1,bg)),v0),0.,1.);
    float rim=smoothstep(.54,.64,len)*(1.-smoothstep(.96,1.04,len));
    return alphaColor(mix(dark,light,bg)*rim);
  }
  void main() {
    vec2 uv=(vUv*iResolution.xy-iResolution.xy*.5)/min(iResolution.x,iResolution.y)*2.; float s=sin(rot),c=cos(rot); uv=vec2(c*uv.x-s*uv.y,s*uv.x+c*uv.y);
    uv.x+=hover*hoverIntensity*.1*sin(uv.y*10.+iTime); uv.y+=hover*hoverIntensity*.1*sin(uv.x*10.+iTime);
    vec4 col=draw(uv); gl_FragColor=vec4(col.rgb*col.a,col.a);
  }
`;

export default function Orb({ hue = 0, hoverIntensity = 2, rotateOnHover = true, forceHoverState = false, backgroundColor = '#000000' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Vec3(1, 1, 1) }, hue: { value: hue }, hover: { value: 0 }, rot: { value: 0 }, hoverIntensity: { value: hoverIntensity }, backgroundColor: { value: hexToVec3(backgroundColor) }
    } });
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      const dpr = window.devicePixelRatio || 1, width = container.clientWidth, height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr); gl.canvas.style.width = `${width}px`; gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    };
    const setHover = event => {
      const rect = container.getBoundingClientRect(), size = Math.min(rect.width, rect.height);
      const x = ((event.clientX - rect.left - rect.width / 2) / size) * 2, y = ((event.clientY - rect.top - rect.height / 2) / size) * 2;
      targetHover = Math.hypot(x, y) < .8 ? 1 : 0;
    };
    let targetHover = 0, lastTime = 0, rotation = 0, frameId;
    const render = time => {
      frameId = requestAnimationFrame(render); const delta = (time - lastTime) * .001; lastTime = time;
      program.uniforms.iTime.value = time * .001; program.uniforms.hue.value = hue; program.uniforms.hoverIntensity.value = hoverIntensity; program.uniforms.backgroundColor.value = hexToVec3(backgroundColor);
      const activeHover = forceHoverState ? 1 : targetHover; program.uniforms.hover.value += (activeHover - program.uniforms.hover.value) * .1;
      if (rotateOnHover && activeHover > .5) rotation += delta * .3; program.uniforms.rot.value = rotation; renderer.render({ scene: mesh });
    };
    window.addEventListener('resize', resize); container.addEventListener('mousemove', setHover); container.addEventListener('mouseleave', () => { targetHover = 0; }); resize(); frameId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', resize); container.removeEventListener('mousemove', setHover); gl.canvas.remove(); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [backgroundColor, forceHoverState, hoverIntensity, hue, rotateOnHover]);

  return <div ref={containerRef} className="orb-container" />;
}

function hexToVec3(color) {
  const value = color.startsWith('#') ? color.slice(1) : '000000';
  return new Vec3(parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255);
}
