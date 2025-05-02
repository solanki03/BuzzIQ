// to stop the camera

export const stopCamera = () => {
  const tracks = window.videoStream?.getTracks?.();
  if (tracks && tracks.length > 0) {
    tracks.forEach((track) => track.stop());
    // console.log("Camera stopped successfully.");
  }
};
