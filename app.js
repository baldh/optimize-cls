const src1 = 'https://source.unsplash.com/gG-4Lu0G46A';
const src2 = './reeds.jpg';

fetch(src2)
  .then(response => response.blob())
  .then(imgBlob => {
    let img = new Image();
    img.src = URL.createObjectURL(imgBlob);
    img.onload = () => console.log(img.height);
  });
