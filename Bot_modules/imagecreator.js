const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas');
const fs = require('fs')

module.exports = async function create_board_image(board_arr)
{
    let image_arr =[{
      src: './Bot_modules/textures/bl.png', x: 0, y: 0}
    ];

    for(let i = 0; i < board_arr.length; i++){
    for(let j = 0; j < board_arr[i].length; j++){
          image_arr[image_arr.length] = {
              src: './Bot_modules/textures/'+board_arr[i][j].skin + '.png',
              x: j*64,
              y: i*64
          }
      }
    }
    let b64 = await mergeImages(image_arr,{ Canvas: Canvas,Image: Image })
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

  