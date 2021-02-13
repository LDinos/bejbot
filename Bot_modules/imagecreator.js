const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas');
const fs = require('fs')

module.exports = async function create_board_image(board_arr)
{
  let maxwidth = 0;
  let maxheight = board_arr.length
    let image_arr =[{
      src: './Bot_modules/textures/board.png', x: 0, y: 0}
    ];

    for(let i = 0; i < board_arr.length; i++){
      if (board_arr[i].length >= maxwidth) maxwidth = board_arr[i].length
    for(let j = 0; j < board_arr[i].length; j++){
        const path = './Bot_modules/textures/'+board_arr[i][j].skin+board_arr[i][j].power + '.png'
        if (fs.existsSync(path)) {
          image_arr[image_arr.length] = {
              src: path,
              x: j*64,
              y: i*64
          }
        }
      }
    }
    if (maxwidth > 8) maxwidth = 8
    if (maxheight > 8) maxheight = 8
    let b64 = await mergeImages(image_arr,{ Canvas: Canvas,Image: Image, width : maxwidth*64, height : maxheight*64})
    var data = b64.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    fs.writeFile('image.png', buf, err => {
        if(err)console.log('error', err);
     });
    // mergeImages(image_arr,{
    //   Canvas: Canvas,
    //   Image: Image
    // }).then(b64 => {
    //   var data = b64.replace(/^data:image\/\w+;base64,/, "");
    //   var buf = new Buffer.from(data, 'base64');
    //   fs.writeFile('image.png', buf, err => {
    //     if(err)console.log('error', err);
    //   });
    // });
    
}

  