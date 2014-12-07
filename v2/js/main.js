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

        /**
         * Returns null on failure, data-uri on success.
         */
        var makeFace = function(img, cb) {
            $(img).faceDetection({
                complete: function (faces) {
                    highLight(this, faces);
                    var vData;
                    if (faces.length < 1) {
                        console.log('aborting... no detection');
                        cb(null);
                    }

                    vData = cropFace(this[0], faces[0]);
                    cb(vData);
                }
            });
        };


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


        $('#mix').click(makeMix);

        $('#go').click(function() {

            function finish() {
                makeMix();
            }

            var photos = 8;
            var interval = 0;
            var maxTries = 100;

            function run() {
                maxTries--;
                console.log(photos);

                takeSnapshot();
                if ((maxTries == 0) || (photos == 0)) {
                    clearTimeout(interval);
                    finish();
                    return;
                }

                $('#picture').faceDetection({
                    complete: function (faces) {
                        var vData;
                        if (faces.length < 1) {
                            console.log('aborting... no detection');
                        } else {
                            cropFace(this[0], faces[0]);
                            addFaceToFaces();
                            photos--;
                        }
                        interval = setTimeout(run, 1000);
                    }
                });

            }

            interval = setTimeout(run, 1000);
        });

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



        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                takeSnapshot();
                $('#picture').faceDetection({
                    complete: function (faces) {
                        var vData;
                        if (faces.length < 1) {
                            console.log('aborting... no detection');
                        } else {
                            for(i=0; i<faces.length; i++) {
                                cropFace(this[0], faces[i]);
                                addFaceToFaces();
                            }
                        }
                    }
                });
            }
            else if (e.keyCode == '40') {
                $('#mix').click();
            }
        }

        function clearHighlights() {
            $('.face').remove();
        }

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

        var addFaceToFaces = function(dataURL) {
            var img, myFace, l, a;
            myFace = $('<img />', {src: dataURL});
            l = $('<li>');
            a = $('<a class="th" role="button" href="#"></a>');
            a.append(myFace);
            l.append(a);

            $('.face-library').append(l);

        }

        function cropFace(img, cropData) {
            var ctx, canvas;
            canvas = $('<canvas width="300" height="300"/>')[0];
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0,  300,300);
            return canvas.toDataURL();
        }

        function takeSnapshot() {
            Webcam.snap( function(data_uri) {
                var img = $('#last img');
                img.attr('src', data_uri);

                img.faceDetection({
                    complete: function (faces) {
                        clearHighlights();
                        highLight(this, faces);
                        var vData;
                        if (faces.length < 1) {
                            console.log('aborting... no detection');
                            return;
                        }
                        for (i=0; i<faces.length; i++) {
                            dataURL = cropFace(img[0], faces[i]);
                            addFaceToFaces(dataURL);
                        }
                        Webcam.unfreeze('#cam');
                    }
                });


            });
        };



        DEBUG === false && Webcam.attach('#cam');
        $('.click-photo a').click(function() {
            takeSnapshot();
        })

    });

})(jQuery);
