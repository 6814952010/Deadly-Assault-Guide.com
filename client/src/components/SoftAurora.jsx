import { Geometry, Mesh, Program, Renderer } from 'ogl'
import { useEffect, useRef } from 'react'
import './SoftAurora.css'

const hexToVec3 = hex => {
  const value = hex.replace('#', '')
  return [parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255]
}

const vertex = `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0.,1.); }`
const fragment = `precision highp float;
uniform float uTime,uSpeed,uScale,uBrightness,uNoiseFrequency,uNoiseAmplitude,uBandHeight,uBandSpread,uOctaveDecay,uLayerOffset,uColorSpeed,uMouseInfluence,uEnableMouse;
uniform vec2 uMouse; uniform vec3 uColor1,uColor2; varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=1.; for(int i=0;i<3;i++){v+=a*noise(p);p*=2.;a*=uOctaveDecay;}return v;}
void main(){vec2 uv=vUv; uv.y+=((uMouse.y-.5)*uMouseInfluence)*uEnableMouse; float t=uTime*uSpeed*.22; float n=fbm(vec2(uv.y*uNoiseFrequency+t,uv.x*uScale)); float wave=.5+.5*sin(uv.y*uNoiseFrequency*3.+t+n*uNoiseAmplitude*5.); float band=exp(-abs(uv.x-(uBandHeight+.12*(n-.5)))*max(1.,uBandSpread)*9.); float streak=(.22+.78*pow(wave,2.))*band; vec3 c=mix(uColor1,uColor2,.5+.5*sin(uv.y*4.+t*uColorSpeed+uLayerOffset)); c*=streak*uBrightness; gl_FragColor=vec4(c,clamp(length(c)*1.3,0.,1.));}`

export default function SoftAurora({ speed = .6, scale = 1.5, brightness = 1, color1 = '#f7f7f7', color2 = '#e100ff', noiseFrequency = 2.5, noiseAmplitude = 1, bandHeight = .5, bandSpread = 1, octaveDecay = .1, layerOffset = 0, colorSpeed = 1, enableMouseInteraction = true, mouseInfluence = 0 }) {
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const program = new Program(gl, { vertex, fragment, uniforms: {
      uTime: { value: 0 }, uSpeed: { value: speed }, uScale: { value: scale }, uBrightness: { value: brightness }, uColor1: { value: hexToVec3(color1) }, uColor2: { value: hexToVec3(color2) }, uNoiseFrequency: { value: noiseFrequency }, uNoiseAmplitude: { value: noiseAmplitude }, uBandHeight: { value: bandHeight }, uBandSpread: { value: bandSpread }, uOctaveDecay: { value: octaveDecay }, uLayerOffset: { value: layerOffset }, uColorSpeed: { value: colorSpeed }, uMouse: { value: new Float32Array([.5, .5]) }, uMouseInfluence: { value: mouseInfluence }, uEnableMouse: { value: enableMouseInteraction ? 1 : 0 },
    } })
    const geometry = new Geometry(gl, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }, uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) } })
    const mesh = new Mesh(gl, { geometry, program })
    const resize = () => renderer.setSize(container.offsetWidth, container.offsetHeight)
    const move = event => { const rect = gl.canvas.getBoundingClientRect(); program.uniforms.uMouse.value[0] = (event.clientX - rect.left) / rect.width; program.uniforms.uMouse.value[1] = 1 - (event.clientY - rect.top) / rect.height }
    resize(); window.addEventListener('resize', resize); if (enableMouseInteraction) gl.canvas.addEventListener('mousemove', move); container.appendChild(gl.canvas)
    let frame; const render = time => { program.uniforms.uTime.value = time * .001; renderer.render({ scene: mesh }); frame = requestAnimationFrame(render) }; frame = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); gl.canvas.removeEventListener('mousemove', move); gl.canvas.remove(); gl.getExtension('WEBGL_lose_context')?.loseContext() }
  }, [speed, scale, brightness, color1, color2, noiseFrequency, noiseAmplitude, bandHeight, bandSpread, octaveDecay, layerOffset, colorSpeed, enableMouseInteraction, mouseInfluence])
  return <div ref={containerRef} className="soft-aurora-container" />
}
