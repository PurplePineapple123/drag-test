import { useEffect, useRef } from 'react'


export default function useEventListener(eventType, callback, element = window) {

  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])


  useEffect(() => {
    const handler = e => callbackRef.current(e)
    element.addEventListener(eventType, handler)
   // console.log(element);
    

    return () => {
      element.removeEventListener(eventType, handler)
    }
  }, [eventType, element])

}





// // See: https://usehooks.com/useEventListener/
// export default function(eventName, handler, element = window) {

//  // console.log(eventName);


//   // Create a ref that stores handler
//   const savedHandler = useRef(handler)

//   // Update ref.current value if handler changes.
//   // This allows our effect below to always get latest handler ...
//   // ... without us needing to pass it in effect deps array ...
//   // ... and potentially cause effect to re-run every render.
//   useEffect(() => {
//     savedHandler.current = handler
//   }, [handler])

//   useEffect(() => {

//       // Make sure element supports addEventListener
//       // On
//       const isSupported = element && element.addEventListener
//       if (!isSupported) return

//       // Create event listener that calls handler function stored in ref
//       const eventListener = event => savedHandler.current(event)

//       // Add event listener
//       element.addEventListener(eventName, eventListener)

//       // Remove event listener on cleanup
//       return () => {
//         element.removeEventListener(eventName, eventListener)
//       }
//     },
//     [eventName, element] // Re-run if eventName or element changes
//   )
// }
