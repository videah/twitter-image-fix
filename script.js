$(function() {
    // JS is terrible m'kay
    $('.ui.menu')
        .on('click', '.item', function() {
            if (!$(this).hasClass('dropdown')) {
                $(this)
                    .addClass('active')
                    .siblings('.item')
                    .removeClass('active');
            }
        });

    function downloadImage(image, filename) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = image.toDataURL();
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(image);
        $.suiAlert({
            title: 'Image Fixed',
            description: 'Successfully fixed image, downloading ' + filename,
            type: 'success',
            time: '3',
            position: 'top-right',
        });
    }

    function processImage() {
        var file = $('#file')[0].files[0];
        var reader = new FileReader();
        reader.onload = async function(e) {
            console.log("Success!");
            console.log(e);
            $('#script-helper').text(e.target.result);

            var image = await IJS.Image.load($('#script-helper').text());
            image.bitDepth = 8;

            var avatarButton = $('#avatar-choice');
            var bannerButton = $('#banner-choice');

            if (bannerButton.hasClass('active')) {
                console.log("Uploaded avatar");
                if (image.width == 1500 && image.height == 500) {
                    downloadImage(image, "fixed-twitter-banner.png")
                } else {
                    $.suiAlert({
                        title: 'Invalid Size',
                        description: 'Profile banners have to be exactly 1500x500, please crop your image to this size.',
                        type: 'error',
                        time: '3',
                        position: 'top-right',
                    });
                }
            }

            if (avatarButton.hasClass('active')) {
                console.log("Uploaded avatar");
                if (image.width == 400 && image.height == 400) {
                    downloadImage(image, "fixed-twitter-avatar.png")
                } else {
                    $.suiAlert({
                        title: 'Invalid Size',
                        description: 'Profile pics have to be exactly 400x400, please crop your image to this size.',
                        type: 'error',
                        time: '3',
                        position: 'top-right',
                    });
                }
            }
        };
        reader.readAsDataURL(file);
    }

    $('#file').on('change', function(e) {
        processImage();
    })

    $('#holder').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('hover');

        var dt = event.dataTransfer;
        var files = dt.files;

        var count = files.length;
        $('#file')[0].files = files;

        console.log(count);
        console.log($('#file'));

        processImage();
    })
    $('#holder').on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass('hover');
    })
    $('#holder').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('hover');
    })
    $('#holder').on('click', function(e) {
        $('#file').trigger('click');
    })
});