import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    // FileTransferPlugin,
    GammaCorrectionPlugin,
    // CanvasSnipperPlugin,
    // addBasePlugins,
    mobileAndTabletCheck
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { scrollAnimation } from '../lib/scroll-animation';
gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = forwardRef((props, ref) => {
        const canvasRef = useRef(null);
        const [viewerRef, setViewerRef] = useState(null);
        const [targetRef, setTargetRef] = useState(null);
        const [cameraRef, setCameraRef] = useState(null);
        const [positionRef, setPositionRef] = useState(null);
    const canvasContainerRef = useRef(null)        
    const [ previewMode ,setpreviewMode]  = useState(false)
        useImperativeHandle(ref,()=>({
            triggerPreview(){
                setpreviewMode(true);
                canvasContainerRef.current.style.pointerEvents="all";
                props.contentRef.current.style.opacity = "0";

                gsap.to(positionRef,{
                x: 13.04,
                y: -2.01,
                z:2.29,
                duration:2,
                onUpdate:()=>{
                    viewerRef.setDirty();
                    cameraRef.positionTargetUpdated(true);
                }
                });
                gsap.to(targetRef,{ x:0.11, y: 0.0, z:0.0, duration:2 })
            
                viewerRef.scene.activeCamera.setCameraOptions({controlsEnabled:true})
            }
        }));

        const memorizedScrollAnimation = useCallback(
            (position, target, onUpdate) => {
                if (position && target && onUpdate) {
                    scrollAnimation(position, target, onUpdate);
                }
            }, []
        )
        const setupViewer = useCallback(async () => {

            // Initialize the viewer
            const viewer = new ViewerApp({
                canvas: canvasRef.current,
            })
            setViewerRef(viewer)

            const manager = await viewer.addPlugin(AssetManagerPlugin);

            const camera = viewer.scene.activeCamera;
            const position = camera.position;
            const target = camera.target;

            setCameraRef(camera)
            setPositionRef(position)
            setTargetRef(target)
            // Add plugins individually.
            await viewer.addPlugin(GBufferPlugin)
            await viewer.addPlugin(new ProgressivePlugin(32))
            await viewer.addPlugin(new TonemapPlugin(true))
            await viewer.addPlugin(GammaCorrectionPlugin)
            await viewer.addPlugin(SSRPlugin)
            await viewer.addPlugin(SSAOPlugin)

            await viewer.addPlugin(BloomPlugin)


            // or use this to add all main ones at once.
            // await addBasePlugins(viewer) // check the source: https://codepen.io/repalash/pen/JjLxGmy for the list of plugins added.

            // Add a popup(in HTML) with download progress when any asset is downloading.
            // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

            // Required for downloading files from the UI
            // await viewer.addPlugin(FileTransferPlugin)

            // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
            // await viewer.addPlugin(CanvasSnipperPlugin)
            viewer.renderer.refreshPipeline();
            // Import and add a GLB file.
            await manager.addFromPath("scene-black.glb")

            viewer.getPlugin(TonemapPlugin).config.clipBackground = true

            // Load an environment map if not set in the glb file
            // await viewer.setEnvironmentMap("./assets/environment.hdr");

            // Add some UI for tweak and testing
            // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
            // Add plugins to the UI to see their settings.
            // uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

            viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

            window.scrollTo(0, 0);

            let needsUpdate = true;
            const onUpdate = () => {
                needsUpdate = true;
                viewer.setDirty();
            }

            viewer.addEventListener("preFrame", () => {
                if (needsUpdate) {
                    camera.positionTargetUpdated(true)
                    needsUpdate = false
                }
            })
            memorizedScrollAnimation(position, target, onUpdate)
        }, []);

        useEffect(() => {
            setupViewer()

        }, [])

        const handleExit = useCallback(()=>{
            canvasContainerRef.current.style.pointerEvents="none";
            props.contentRef.current.style.opacity = "1";
            viewerRef.scene.activeCamera.setCameraOptions({controlsEnabled: false})
            setpreviewMode(false)

            gsap.to(positionRef,{
                x: 1.56,
                y: 5.0,
                z:  0.01,
                scrollTrigger:{
                    trigger:".display-section",
                    start:"top bottom",
                    end:"top top",
                    scrub: 2,
                    immediateRender:false
                },
                onUpdate:()=>{
                    viewerRef.setDirty();
                    cameraRef.positionTargetUpdated(true)
                }
            });
           gsap .to(targetRef,{
                x: -0.55,
                y: 0.32,
                z: 0.0,
                scrollTrigger:{
                    trigger:".display-section",
                    start:"top bottom",
                    end:"top top",
                    scrub: 2,
                    immediateRender:false
                },
        })

        }, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef])

        return (
            <div ref={canvasContainerRef} id='webgi-canvas-container'>
                <canvas id='webgi-canvas' ref={canvasRef}></canvas>
                {
                    previewMode&& (
                        <button className='button' onClick={handleExit}>Exit</button>
                    )
                }
            </div>
        )
    }

)

export default WebgiViewer