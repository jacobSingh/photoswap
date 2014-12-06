DEBUG = false;
//DEBUG_FROM = "mix";
(function($) {
    $(document).ready(function(){

        PS = {};
        PS.faces = [];

        //$('#mix').hide();
        // Make this dynamic and detected.
        KLUDGE_DEST_HEIGHT = 213;

        DEBUG == true && $('#picture').attr('src', 'img/demo.jpg');

        var makeFace = function() {
            $(this).faceDetection({
                complete: function (faces) {
                    highLight(this, faces);
                    var vData;
                    if (faces.length < 1) {
                        console.log('aborting... no detection');
                        return;
                    }

                    vData = cropFace(this[0], faces[0]);
                }
            });
        };

        function highLight(elem, faces) {
            for (var i = 0; i < faces.length; i++) {

                $('<div>', {
                    'class':'face',
                    'css': {
                        'position': 'absolute',
                        'left':     faces[i].x * faces[i].scaleX + 'px',
                        'top':      faces[i].y * faces[i].scaleY + 'px',
                        'width':    faces[i].width  * faces[i].scaleX + 'px',
                        'height':   faces[i].height * faces[i].scaleY + 'px'
                    }
                }).insertAfter(elem);
            }
        }

        function takeSnapshot() {
            Webcam.snap( function(data_uri) {
                console.log(data_uri.length);
                $('#picture').attr('src', data_uri);
            } );
        };

        var addFaceToFaces = function() {
            var img, myFace;
            myFace = $('<img />');
            myFace.attr('src', $('canvas', this)[0].toDataURL());
            $('#faces').append(myFace);
        }

        function cropFace(img, cropData) {
            var ctx, canvas;
            canvas = $('#face')[0];
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0,  canvas.height,canvas.width);
        }

        function makeMix() {
            var faces;
            var pickedFaces = [];
            var rand;
            var i,j;
            var pieces = 3;
            var srcSectionHeight, dstSectionHeight;
            var sourceY = 0;
            var destY = 0;
            var img, imgWidth, canvas, ctx ;


            canvas = document.getElementById('result');
            ctx = canvas.getContext('2d');
            dstSectionHeight = canvas.height / pieces;

            // pick 3 random ones;
            var faces = $('#faces img');
            faces.sort(function(a,b) { return Math.random() > 0.5 ? -1 : 1});
            pickedFaces = faces.slice(0,pieces);

            srcSectionHeight = pickedFaces[0].naturalHeight / pieces;
            imgWidth = pickedFaces[0].naturalWidth;


            for (j=0; j<pickedFaces.length; j++) {
                img = pickedFaces[j];
                console.log(j);
                ctx.drawImage(img, 0, sourceY, imgWidth, srcSectionHeight, 0, destY, canvas.width, dstSectionHeight);
                sourceY += srcSectionHeight;
                destY += dstSectionHeight;
            }
            console.log(pickedFaces);
        }

        //function getSection(img, )

        $('#picture').click(makeFace);
        $('#my-camera').click(takeSnapshot);
        $('#face-wrapper').click(addFaceToFaces);
        $('#mix').click(makeMix);

        if (DEBUG === true && DEBUG_FROM === "mix") {
            myFace = $('<img />');
            myFace.attr('src', 'img/face1.jpg');
            $('#faces').append(myFace);
            myFace = $('<img />');
            myFace.attr('src', 'img/face2.jpg');
            $('#faces').append(myFace);
            myFace = $('<img />');
            myFace.attr('src', 'img/face3.jpg');
            $('#faces').append(myFace);
        }
    });

})(jQuery);


DEBUG === false && Webcam.attach( '#my-camera' );