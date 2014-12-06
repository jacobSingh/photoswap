(function($) {
    $(document).ready(function(){

    var makeFace = function() {
        $(this).faceDetection({
            complete: function (faces) {
                console.log(faces);
                if (faces.length < 1) {
                    console.log('aborting... no detection');
                    return;
                }
                cropFace(this[0], faces[0]);
                console.log(faces);
            }
        });
    };

    function takeSnapshot() {
        Webcam.snap( function(data_uri) {
            console.log(data_uri.length);
            $('#picture').attr('src', data_uri);
        } );
    };


    function cropFace(img, cropData) {
        var tempCtx, tempCanvas, destWidth;
        tempCanvas = document.createElement('canvas');
        tempCtx = tempCanvas.getContext('2d');
        //tempCanvas.width = theSelection.w;
        //tempCanvas.height = theSelection.h;
        destWidth = cropData.width *  tempCanvas.height /cropData.height
        tempCtx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, destWidth, tempCanvas.height);
        var vData = tempCanvas.toDataURL();
        $('#face').attr('src', vData);
    }

    $('#picture').click(makeFace);
    $('#my-camera').click(takeSnapshot);


    });

})(jQuery);

Webcam.attach( '#my-camera' );

Webcam.on('load', function() {

});