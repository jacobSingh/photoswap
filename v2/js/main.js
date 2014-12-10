DEBUG = false;
//DEBUG_FROM = "mix";
(function($) {

    var initializeKeys = function() {
        document.onkeydown = checkKey;
        function checkKey(e) {

            e = e || window.event;
            if (e.keyCode == '32') { //space
                // Click the first button (1 pic or mashup)
                $('.controls .active .button')[0].click();
            }
            else if (e.keyCode == '37') {
                switchToPhoto();
            }
            else if (e.keyCode == '39') {
                switchToMashups();
            }
        }
    }

    function pickRandomFaces(number) {
        var faces = $('.face-library img');
        faces.sort(function(a,b) { return Math.random() > 0.5 ? -1 : 1});
        return faces.slice(0,number);
    }


    function makeMix(faces) {
        var pieces = faces.length;
        var srcSectionHeight, dstSectionHeight;
        var sourceY = 0;
        var destY = 0;
        var img, imgWidth, ctx, canvas ;

        canvas = document.createElement('canvas')
        canvas.setAttribute('height', faces[0].naturalHeight);
        canvas.setAttribute('width', faces[0].naturalWidth);
        ctx = canvas.getContext('2d');
        dstSectionHeight = canvas.height / pieces;

        srcSectionHeight = faces[0].naturalHeight / pieces;
        imgWidth = faces[0].naturalWidth;

        for (j=0; j < faces.length; j++) {
            img = faces[j];
            ctx.drawImage(img, 0, sourceY, imgWidth, srcSectionHeight, 0, destY, canvas.width, dstSectionHeight);
            sourceY += srcSectionHeight;
            destY += dstSectionHeight;
        }

        return canvas.toDataURL();
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
        $('.face-library').prepend(l);

    }

    function cropFace(img, cropData) {
        var ctx, canvas;
        canvas = $('<canvas width="300" height="300"/>')[0];
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0,  300,300);
        return canvas.toDataURL();
    }

    function takeSnapshot(success, failure) {
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
                        failure();
                        return;
                    }
                    for (i=0; i<faces.length; i++) {
                        dataURL = cropFace(img[0], faces[i]);
                        addFaceToFaces(dataURL);
                        success();
                        return;
                    }
                }
            });
        });
    };

    function switchToPhoto() {
        $('.photo-booth').addClass('active');
        $('.mashup-maker').removeClass('active');
    }

    function switchToMashups() {

        $('.mashup-maker').addClass('active');
        $('.photo-booth').removeClass('active');
        faces = pickRandomFaces(3);
        if (faces.length < 3) {
            $('.mashup-error').show();
            return;
        } else {
            $('.mashup-error').hide();
        }
        $('#mashup').attr({src: makeMix(faces)});
    }

    function startPhotoShoot() {
        var clicks = $(this).data('number');
        var go; //function callback for getInterval

        var success = function() {
            clicks--;
            console.log(clicks);
            if (clicks == 0) {
                return;
            }
            setTimeout(go, 1000);
        };

        var failure = function() {
            setTimeout(go, 1000);
        }

        var go = function() {
            takeSnapshot(success, failure);
        }
        go();
    }

    $(document).ready(function(){

        initializeKeys();
        // @todo: add support for fragment ID
        switchToPhoto();
        Webcam.attach('#cam');

        $('.click-photo a').click(startPhotoShoot);

        $('.mashup-button').click(function() {
            faces = pickRandomFaces(3);
            $('#mashup').attr({src: makeMix(faces)});
        });

        var crazyInterval;
        $('.mashup-crazy').click(function() {
            $('.mashup-crazy').hide();
            $('.mashup-crazy-stop').show();
            var crazytime = function() {
                faces = pickRandomFaces(3);
                $('#mashup').attr({src: makeMix(faces)});
            }
            crazyInterval = setInterval(crazytime, 50);
        });

        $('.mashup-crazy-stop').click(function() {
            $('.mashup-crazy').show();
            $('.mashup-crazy-stop').hide();
            clearInterval(crazyInterval);
        });

        $('#mode-switch').on('change',function() {
            if (this.checked === true) {
                switchToMashups();
            } else {
                switchToPhoto();
            }
        });

        $('#good-joke').click(function(){
            $('#bad-joke').css('font-weight', 'bold');
        });

    });

})(jQuery);
