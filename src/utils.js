import { contain } from "intrinsic-scale";
import React from "react";
import { TopicTypes } from "config/constants";

function getThumbFromVideo($video, size) {
  const $canvas = document.createElement("canvas");
  size = size || 300;

  // Preserve aspect ratio
  const { width, height } = contain(
    size,
    size,
    $video.videoWidth,
    $video.videoHeight
  );
  $canvas.width = width;
  $canvas.height = height;

  $canvas.getContext("2d").drawImage($video, 0, 0, width, height);
  console.log($canvas);
  console.log(width);
  return new Promise(res => $canvas.toBlob(res, "image/jpeg", 0.8));
}

function createVideoFromFile(file) {
  return new Promise(res => {
    const $video = document.createElement("video");

    $video.onloadedmetadata = () => {
      $video.currentTime = Math.round($video.duration / 2);
      $video.oncanplay = () => res($video);
    };

    $video.src = URL.createObjectURL(file);
  });
}

function getTopicTypeText(type, $elem) {
  $elem = $elem || <td />;

  switch (type) {
    case TopicTypes.Public:
      return React.cloneElement($elem, null, ["Publicado"]);
    case TopicTypes.Draft:
      return React.cloneElement($elem, { style: { color: "red" } }, [
        "Borrador"
      ]);
  }
}

export { getThumbFromVideo, createVideoFromFile, getTopicTypeText };
