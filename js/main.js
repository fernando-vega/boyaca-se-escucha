$(window).load(function () {

    //Social Feed
    $('#social-feed').each(function (index, el) {
        $.socialFeed($(this));
    });

    // MENU FIXED    
    var alturamenu = $('header').offset().top;
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > alturamenu) {
            $('.content-header').addClass('menu-fixed');
        } else {
            $('.content-header').removeClass('menu-fixed');
        }
    });

    //MENU RESPONSIVE



    //BOTTOM
    var trigger = $('#hamburger'),
        isClosed = true;

    trigger.click(function () {
        burgerTime();
    });

    function burgerTime() {
        if (isClosed == false) {
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = true;
            $('nav').removeClass('active-menu');
            $('.content-social-icons').removeClass('active-social');
        } else {
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = false;
            $('nav').addClass('active-menu');
            $('.content-social-icons').addClass('active-social');
        }
    }

    // Slides
    $("#slider-index").owlCarousel({

        navigation: true,
        slideSpeed: 1000,
        paginationSpeed: 400,
        singleItem: true,
        autoPlay: true,
        navigation: false,
        responsive: true,
        lazyLoad: true,
        transitionStyle: "fade",
    });

    $("#slider-video").owlCarousel({
        itemsCustom: [
            [300, 1],
            [800, 2],
            [1200, 3]
        ],
        autoPlay: true,
        navigation: false,
        pagination: false,
    });

    // Progres bar
    // on page load...
   // $.moveProgressBar();  <--
    // on browser resize...
    $(window).resize(function() {
        $.moveProgressBar($(this));
    });

     $.moveProgressBar();

    // img to svg   
    $('.to-svg').each(function (index, el) {
        $.imgToSvg($(this));
    });
    // resizing
    $('.js-resizing').each(function (index, el) {
        $.resizing($(this));
    });

    // Active Form
    $(".form__ajax").on("submit", function (e) {
        e.preventDefault(), $.activeLoading(), $form = $(this),
            $.ajax({
                url: $form.attr("action"),
                type: $form.attr("method"),
                dataType: "json",
                data: $form.serialize()
            }).done(function (e) {
                $.showMessage(e.message)
            }).fail(function () {
                $.showMessage("Fallo durante la conexión al servidor. Intente mas tarde")
            }).always(function () {
                $.deactiveLoading(),
                    $('form').trigger("reset")
            })
    })

    // FANCYBOX
    $('.fancybox-media').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 4,
        helpers: {
            media: {}
        }
    });
});

$.imgToSvg = function (image) {
    var $img = image;
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    $.get(imgURL, function (data) {
        var $svg = jQuery(data).find('svg');
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }
        $svg = $svg.removeAttr('xmlns:a');
        $img.replaceWith($svg);

        if ($img.hasClass('map-animate'))
            $.myScrollAnimate();
    }, 'xml');
}
$.resizing = function (element) {
    $(window).resize(function () {
        var width = element.outerWidth();
        element.css({
            "height": width * eval(element.attr('data-resizing'))
        });
        if (element.hasClass('panel')) {
            element.parent().find('.panel').css({
                "height": width * eval(element.attr('data-resizing'))
            });
        }
    }).resize();
}

// POPUPS
$.activeLoading = function () {
    $(".modal__loading").addClass("active")
}, $.deactiveLoading = function () {
    $(".modal__loading").removeClass("active")
}, $.showMessage = function (t, e) {
    e = e || "", $box = $(".message__popup"), $box.find(".message__text").text(t), $box.addClass("active"), setTimeout(function () {
        $box.removeClass("active"), setTimeout(function () {
            $box.find(".message__text").text("")
        }, 400)
    }, 8e3)
}

// SIGNATURE PROGRESS
$.moveProgressBar = function () {
    var percent;
    var getProgressWrapWidth;
    var progressTotal;
    var animationLength = 2500;
    $('.progress').each(function (i, value){
        percent = ($(value).data('progress-percent') / 115);
        getProgressWrapWidth = $('.progress').width();
        progressTotal = percent * getProgressWrapWidth;
        $(value).children().stop().animate({
            left: progressTotal
        }, animationLength);
    });
}

// Social Feed
$.socialFeed = function (content) {
    var gridOptions = {
        itemSelector: '.social-feed-element',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    };
    content.socialfeed({
        facebook: {
            accounts: ['@Boyacaseescucha', '#boyacaseescucha'],
            limit: 5,
            access_token: '238633773278264|3fbae685a0b37c7b2a3265f453199b84'
        },
        twitter: {
            accounts: ['@boyseescucha'],
            limit: 5,
            consumer_key: 'AKKltjX0hfabCm5bwDx2zrzZB',
            consumer_secret: '8OncjL3pI8acpmjF3bICLK9kehmBqeQQ7PBVOXzROEZ94TegwB',
        },
        // GENERAL SETTINGS
        length: 200,
        show_media: true,
        template: '_template-social.html',
        // Moderation function - if returns false, template will have class hidden
        moderation: function (content) {
            return (content.text) ? content.text.indexOf('fuck') == -1 : true;
        },
        //update_period: 5000,
        // When all the posts are collected and displayed - this function is evoked
        callback: function () {
            content.imagesLoaded().progress(function () {
                content.masonry(gridOptions);
            });
        }
    });
}