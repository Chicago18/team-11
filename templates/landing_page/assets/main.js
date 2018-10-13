// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

var andrewrossco = andrewrossco || {};

(function($, APP) {
    $(function() {
        APP.App.init();
        APP.Header.init();
        APP.Viewport.init();
        APP.Modal.init();
        APP.ScrollTo.init();
        APP.Sections.init();
        APP.Tabs.init();
        APP.filter.init();
    });

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------

APP.App = {
    userAgent: undefined,
    $html: undefined,

    init: function() {
        APP.Features = APP.Features || {};
        this.userAgent = navigator.userAgent.toLowerCase();
        this.doc = document.documentElement;
        this.noTouch();
        this.isTouch();
        this.isIE();

        $(function(){
            document.body.classList.add("page-ready");
        });
    },

    noTouch: function() {
        if ( ! ('ontouchstart' in window) ) {
            APP.Features.noTouch = false;
            this.doc.classList.add('no-touch');
            return;
        }
    },

    isTouch: function() {
        if ( 'ontouchstart' in window ) {
            APP.Features.isTouch = false;
            this.doc.classList.add('is-touch');
            return;
        }
    },

    isIE: function() {
		if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            if(navigator.appVersion.indexOf('Trident') === -1) {
                this.doc.classList.add('isEDGE');
            } else {
                $('html').addClass('isIE isIE11');
            }
            return;
        }
    }
};


// ---------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------

APP.Header = {

    init: function() {

        var trigger = document.getElementById('mobile-menu-toggle'),
            bd = document.body;

    	trigger.onclick = function() {
    		if( bd.classList.contains('menu-is-open') ){
    	bd.classList.remove('menu-is-open');
    		} else {
    	bd.classList.add('menu-is-open');
    		}
    	}

        var cubeDraw = document.querySelectorAll('#cube-draw polyline');

        for(var p = 0; p < cubeDraw.length; p++) {
            var el = cubeDraw[p];
            TweenLite.to(cubeDraw, 0, {drawSVG:"0%"});

            setTimeout(function(){
                TweenLite.to(cubeDraw, 6, {drawSVG:"100%" });
            }, 2000);
        }



        if ( document.getElementById('intro-icon') ) {

            var logo = document.getElementById('intro-icon'),
                logoSm = document.getElementById('intro-icon-sm'),
                logoType = document.getElementById('icon-logotype'),
                logoTiming = 0.8,
                animated = false;

            TweenMax.to(logoSm, 0, {scale: 0, opacity: 0, ease:Power1.easeIn});

            function movelogos() {
                if( window.pageYOffset > 40 ) {
                    if( animated == false ){
                        moveLogo();
                        animated = true;
                        return;
                    }
                } else {
                    if( animated == true ){
                        moveLogoBack();
                        animated = false;
                        return;
                    }
                }
            }
            window.addEventListener('scroll', movelogos);

            TweenMax.to(logo, 2, {y:"-=8", ease: Power0.easeNone, yoyo:true, repeat:-1});


            function moveLogo() {
                var leftPos = 210;
                if ( window.outerWidth < 800 ) {
                    leftPos = 80;
                }

                var tlLogo = new TimelineMax({delay:0});
                tlLogo.to(logo, 0.6, {scale: 0, ease: Elastic.easeOut.config(0.3, 0.3)});

                TweenMax.to(logoSm, 1, {scale: 1, opacity: 1, ease: Elastic.easeOut.config(0.3, 0.3) });

                if (document.body.clientWidth >= 768) {
                    var logoTypeX = 56;
                } else {
                    var logoTypeX = 48;
                }

                TweenMax.to(logoType, 0.8, {x: logoTypeX, ease: Elastic.easeOut.config(0.3, 0.3) });
            }

            function moveLogoBack() {
                TweenMax.to(logo, 0.5, {scale: 1, opacity: 1, ease: Elastic.easeOut.config(0.3, 0.3) });

                var tlLogoSm = new TimelineMax({delay:0});
                tlLogoSm.to(logoSm, 0.1, {scale: 0});

                TweenMax.to(logoType, 0.8, {x: 0, ease: Elastic.easeOut.config(0.3, 0.3) });
            }
        }

    }
};


// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

APP.Viewport = {

    init: function() {

        var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]'),
            pageOffset = window.pageYOffset;

        function isScrolledIntoView(el) {
            var rect = el.getBoundingClientRect(),
                elemTop = rect.top,
                elemBottom = rect.top + el.offsetHeight,
                bottomWin = pageOffset + window.innerHeight;

            return (elemTop < bottomWin && elemBottom > 0);
        }

        function detect() {
            for(var i = 0; i < items.length; i++) {
                if ( isScrolledIntoView(items[i]) ) {
                    if( !items[i].classList.contains('in-view') ) {
                        items[i].classList.add('in-view');
                    }
                }
                // else {
                //     if( items[i].classList.contains('in-view') ) {
                //         items[i].classList.remove('in-view');
                //     }
                // }
            }
        }

        // window.onscroll = function() {
        //     detect();
        // }
        window.addEventListener('scroll', detect);
        window.addEventListener('resize', detect);
        // window.onresize = function() {
        //     detect();
        // }


		for(var i = 0; i < items.length; i++) {
			var d = 0,
				el = items[i];

			if( items[i].getAttribute('data-animate-in-delay') ) {
				d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
			} else {
				d = 0;
			}
            el.style.transitionDelay = d;
		}

        setTimeout(function(){
            detect();
        }, 500);
    }
};



// ---------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------

APP.Modal = {

    init: function() {

        var trigger = $('.speaker-preview a'),
            modal = $('.modal'),
            modalImage = $('.modal-image > *'),
            modalBody = $('.modal-content > *'),
            b = $('body');

        function getSpeakerModal(el){
            var speaker = el,
                img = speaker.find('.speaker-image').clone(),
                info = speaker.find('.speaker-info').clone(),
                extra = speaker.find('.speaker-content-extra').clone();

            modalImage.append(img);
            modalBody.append(info).append(extra);

            modal.addClass('is-active');
            b.addClass('modal-is-open');
        }

        trigger.click(function(e){
            e.preventDefault();

            var el = $(this),
                speakerId = el.attr('href'),
                p = $(this).parent('.speaker-preview'),
                speaker = $(speakerId);

            history.replaceState(null, '', speakerId);

            getSpeakerModal(p);
        });


        var talkTrigger = $('a.talk');


        function getTalkModal(el){
            var talk = el,
                talkInfo = el.find('.talk-details').clone(),
                speakerImages = el.find('.js-speaker-image'),
                speakerCount = 0;

            el.find('.js-speaker-image').each(function(){
                var imgsrc = $(this).html(),
                    src = '/assets/img/speakers/' + imgsrc,
                    newImg = '<img class="speaker-headshot" src="/assets/img/speakers/' + imgsrc + '" />',
                    imgFull = '<figure class="hexagon-image speaker-image mb-4">' + newImg + '<img class="hex-border-alt" src="/assets/img/hex.svg" alt="pink cube" /><img class="hex-hover" src="/assets/img/hex-hover.png" alt="pink cube" /></figure>';

                modalImage.append(imgFull);
                speakerCount++;
            });
            if( speakerCount > 1 ) {
                document.querySelector('.modal-image').classList.add('dubs-images');
            }
            modalBody.append(talkInfo);

            modal.addClass('is-active');
            b.addClass('modal-is-open');
        }

        talkTrigger.click(function(e){
            e.preventDefault();
            var el = $(this),
                talkId = el.attr('href'),
                talk = $(talkId);

            history.replaceState(null, '', talkId);

            getTalkModal(talk);
        });




        // Check for open modal on load
        $(document).ready(function(){
            var hash = window.location.hash.replace('#', ''),
                aLink = $('.open-modal-sched');

            $('.speaker-preview > a').each(function() {
                var el = $(this),
                    p = $(this).parent('.speaker-preview'),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getSpeakerModal(p);
                    modal.addClass('is-active');
                    b.addClass('modal-is-open');
                }
            });

            $('a.talk').each(function() {
                var el = $(this),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getTalkModal(el);
                    modal.addClass('is-active');
                    b.addClass('modal-is-open');
                }
            });
        });


        // Close Modal
        $('.modal__close').click(function(e){
            e.preventDefault();

            modal.removeClass('is-active');

            setTimeout(function(){
                modalImage.empty();
                modalBody.empty();
            }, 1000);

            b.removeClass('modal-is-open');
            history.replaceState(null, '', ' ');

            setTimeout(function(){
                $(window).trigger('resize');
                document.querySelector('.modal-image').classList.remove('dubs-images');
            }, 600);
        });
    }
};



// ---------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------

APP.Button = {

    init: function() {

        var buttons = document.querySelectorAll('.button');

        for(var i = 0; i < buttons.length; i++) {

            var btn = buttons[i],
                classes = buttons[i].classList.value;

            buttons[i].addEventListener( 'mousemove', function(e) {


                var el = this,
                    rect = this.getBoundingClientRect(),
                    elemTop = rect.top,
                    midPointX = this.offsetLeft + ( this.offsetWidth / 2),
                    midPointY = elemTop + ( this.offsetHeight / 2);

                if (event.clientY <= midPointY) {
                    var y = 'upper';
                } else {
                    var y = 'lower';
                }

                if (event.clientX <= midPointX) {
                    var x = 'left';
                } else {
                    var x = 'right';
                }

                if( x == 'left' && y == 'upper'  ) {
                //    console.log('upper left');
                    el.classList.remove('lowerLeft');
                    el.classList.remove('topRight');
                    el.classList.remove('lowerRight');
                    el.classList.add('topLeft');
                }
                if( x == 'left' && y == 'lower'  ) {
                    //console.log('lower left');
                    el.classList.remove('topLeft');
                    el.classList.remove('topRight');
                    el.classList.remove('lowerRight');
                    el.classList.add('lowerLeft');
                }
                if( x == 'right' && y == 'upper'  ) {
                    el.classList.remove('topLeft');
                    el.classList.remove('lowerLeft');
                    el.classList.remove('lowerRight');
                    el.classList.add('topRight');
                }
                if( x == 'right' && y == 'lower'  ) {
                    //console.log('lower right');
                    el.classList.remove('topLeft');
                    el.classList.remove('lowerLeft');
                    el.classList.remove('topRight');
                    el.classList.add('lowerRight');
                }
            });

            buttons[i].addEventListener( 'mouseout', function(e) {
                this.classList.remove('topLeft');
                this.classList.remove('lowerLeft');
                this.classList.remove('topRight');
                this.classList.remove('lowerRight');

            });
        }
    }
};



// ---------------------------------------------------------------------
// Scroll to
// ---------------------------------------------------------------------

APP.ScrollTo = {

    init: function() {

        $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function() {

            var trigger = $(this).attr('data-scroll-to'),
                target = $("#" + trigger),
                ss = 1000, //scroll speed
                o = 0; // offset

            $('body').removeClass('menu-is-open');


            if( $(this).attr('data-scroll-speed') ) {
                ss = $(this).attr('data-scroll-speed');
            }

            if( $(this).attr('data-scroll-offset') ) {
                o = $(this).attr('data-scroll-offset');
            }

            $('html, body').animate({
                scrollTop: target.offset().top - o
            }, ss);
        });

    }
};



// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------

APP.Tabs = {

    init: function() {

        var tabs = document.querySelectorAll('*[data-tab]'),
            tabBody = document.querySelectorAll('*[data-tab-bd]');

        for(var i = 0; i < tabs.length; i++) {
            var el = tabs[i];

            el.onclick = function() {
                var active = document.querySelector('*[data-tab].is-active'),
                    target = this.getAttribute('data-tab');


                for(var t = 0; t < tabBody.length; t++) {
                    if ( tabBody[t].getAttribute('data-tab-bd') == target) {
                        tabBody[t].classList.add('is-active');
                    } else {
                        tabBody[t].classList.remove('is-active');
                    }
                }
                active.classList.remove('is-active');
                this.classList.add('is-active');
            }
        }


    }
};



// ---------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------

APP.faqs = {

    init: function() {
        var faq = $('.faqs'),
            group = $('.faq-group'),
            gt = $('.faq-group__hd'),
            bd = $('.faq-group__bd');

        TweenMax.to(bd, 1, {height: 0});

        gt.click(function(){
            var el = $(this),
                g = el.parents('.faq-group'),
                b = el.next('.faq-group__bd');

            if( g.hasClass('is-active') ){
                g.removeClass('is-active');
                TweenLite.to(b, 0.6, {height:0})
            } else {
                g.addClass('is-active');
                TweenLite.set(b, {height:"auto"})
                TweenLite.from(b, 0.6, {height:0});
            }
        });
    }
};



// ---------------------------------------------------------------------
// Button BG
// ---------------------------------------------------------------------

APP.Sections = {

    init: function() {

        var section = $('.js-page-section'),
            w = $(window),
            nav = document.getElementById('page-nav'),
            navList = document.getElementById('page-nav-list')


        section.each(function(){
            var el = $(this),
				topPos = el.offset().top - 120,
                bottomPos = el.offset().top + el.innerHeight(),
                elId = '#' + el.attr('ID'),
                navLinks = $('#page-nav-list a');

			w.resize(function() {
                topPos = el.offset().top - 120;
                bottomPos = el.offset().top + el.innerHeight();
			});

            function checkSection() {
                if ( w.scrollTop() >= topPos && w.scrollTop() < bottomPos ){
                    if( !el.hasClass('active-section') ){
                        el.addClass('active-section');

                        navLinks.each(function(){
                            if( $(this).attr('href') == elId ) {
                                navLinks.removeClass('is-active');
                                $(this).addClass('is-active');
                            }
                        });
                    }
                } else {
                    if( el.hasClass('active-section') ){
                        el.removeClass('active-section');
                    }
                }
            }

            w.scroll(function() {
                checkSection();
            });

			w.resize(function() {
                checkSection();
            });

            $(document).ready(function() {
                checkSection();
            });

        });
    }
};


// ---------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------

APP.filter = {

    init: function() {

        if( !document.getElementById('filters') ) {
			return;
		}

        function toggleFilter() {
            if( filterPanel.classList.contains('is-active') ){
                filterPanel.classList.remove('is-active');
                bd.classList.remove('filter-is-active');
            } else {
                filterPanel.classList.add('is-active');
                bd.classList.add('filter-is-active');
            }
        }

        // Filter Toggle
        var filterPanel = document.getElementById('filters'),
            filterToggles = document.querySelectorAll('.js-filter-toggle'),
            bd = document.body;

        for(var ft = 0; ft < filterToggles.length; ft++) {
    		filterToggles[ft].onclick = function() {
                toggleFilter();
    		}
        }
        document.getElementById('filter-screen').onclick = function() {
            toggleFilter();
        }
        // Filter Toggle End


        var filters = document.querySelectorAll('.filter'),
            talk = document.querySelectorAll('.talk'),
            activeTags = [],
            index;


        function findOne(arr2, arr) {
            return arr.some(function (v) {
                return arr2.indexOf(v) >= 0;
            });
        }

        function matchAll(superset, subset) {
            return subset.every(function (value) {
                return (superset.indexOf(value) >= 0);
            });
        }

        function updateCount() {
            document.getElementById('js-active-filter-count').innerHTML = document.querySelectorAll('.talk.is-active').length;
        }
        updateCount();

        for(var i = 0; i < filters.length; i++) {

            filters[i].onclick = function() {
                var el = this,
                    filter = el.getAttribute('data-filter');

                if( el.classList.contains('is-active') ) {
                    console.log('Remove ' + filter);
                    index = activeTags.indexOf(filter);
                    activeTags.splice(index, 1);
                    el.classList.remove('is-active');
                } else {
                    console.log('Add ' + filter);
                    activeTags.push(filter);
                    el.classList.add('is-active');
                }


                for(var t = 0; t < talk.length; t++) {
                    var el = talk[t],
                        tags = el.getAttribute('data-tags');

                    if( !tags ) {
                        el.classList.add('un-active');
                        el.classList.remove('is-active');
                    } else {
                        var tArr = tags.split(', '),
                            length = tArr.length;

                        if( matchAll(tArr, activeTags) ){
                            //console.log('still has all');
                            el.classList.add('is-active');
                            el.classList.remove('un-active');
                            console.log('Match');
                            //availableTags.push(tArr);
                            //Array.prototype.push.apply(availableTags, tArr);
                        } else {
                            //console.log('missing one or more');
                            el.classList.add('un-active');
                            el.classList.remove('is-active');
                        }
                    }
                }
                updateCount();
            }
        }


        document.getElementById('js-filter-reset').onclick = function() {
            for(var t = 0; t < talk.length; t++) {
                var el = talk[t];
                el.classList.remove('un-active');
                el.classList.add('is-active');
            }
            for(var f = 0; f < filters.length; f++) {
                var el = filters[f];
                el.classList.remove('is-active');
            }
            activeTags = [];
            updateCount();
        }


        // if( matchAll(tArr, activeTags) ){
        //     //console.log('still has all');
        //     product.addClass('is-active').removeClass('un-active');
        //     availableTags.push(tArr);
        //     Array.prototype.push.apply(availableTags, tArr);
        // } else {
        //     //console.log('missing one or more');
        //     product.addClass('un-active').removeClass('is-active');
        // }





    }
};


}(jQuery, andrewrossco));
