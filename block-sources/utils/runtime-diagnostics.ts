/** ResizeObserver's deferred delivery notification is not a thrown chart exception.
 * https://www.w3.org/TR/resize-observer/#deliver-resize-loop-error
 * Preserve every real error object, even when its text resembles the browser notice.
 */
export function isDeferredResizeNotice(event:{message:string;error?:unknown}):boolean {
 return event.error==null&&['ResizeObserver loop completed with undelivered notifications.','ResizeObserver loop limit exceeded'].includes(event.message);
}
