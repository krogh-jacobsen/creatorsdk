/******************************************************************

    @ Item     Creators ApS - intro page scripts
    @ Rebuilt to match index.html DOM and config.js CONFIG object

 ******************************************************************/

(function ($) {
    "use strict";

    // ── 1. BACKGROUND ────────────────────────────────────────────────
    $(document).ready(function () {

        switch (CONFIG.background) {
            case "slider":
                $("body").vegas({
                    slides: sliderBG,
                    transition: sliderTransition,
                    delay: screenTime,
                    transitionDuration: fadeDuration,
                    firstTransitionDuration: 0,
                    timer: false
                });
                break;
            case "kenburns":
                $("body").vegas({
                    slides: sliderBG,
                    animation: kenburnsEffect,
                    delay: screenTime,
                    transitionDuration: fadeDuration,
                    timer: false
                });
                break;
            case "image":
                $("body").vegas({ slides: [{ src: imageBG }], timer: false });
                break;
            case "youtube":
                $(".player").mb_YTPlayer();
                break;
            case "color":
                $("#bg-overlay").css({ background: solidBG, opacity: 1 });
                break;
        }

        // Background overlay + pattern
        if (bgOverlayMode === "solid") {
            $("#bg-overlay").css("background-color", bgOverlayColor);
        }
        $("#bg-overlay").css("opacity", bgOverlayOpacity);
        $("#bg-pattern").css("opacity", bgPatternOpacity);

        // White skin
        if (CONFIG.skin === "white") { $("body").addClass("white"); }

        // Parallax hover effect
        if (CONFIG.parallax) {
            $("#intro-content").parallax({ scalarX: 20, scalarY: 15, frictionX: 0.1, frictionY: 0.1 });
        }


        // ── 2. OVERLAY SYSTEM ─────────────────────────────────────────
        var blockProcess   = false;
        var currentSection = 0;
        var sections       = $("#overlay > section");
        var numSections    = sections.length;

        var overlayAnimClass = overlayAnimation        === "slide" ? "slide-from-bottom" : "fade-In";
        var contentAnimClass = overlayContentAnimation === "slide" ? "slide-from-bottom" : "fade-In";
        $("#overlay").addClass(overlayAnimClass);
        sections.addClass(contentAnimClass);

        function nextSection() {
            if (blockProcess || currentSection >= numSections) { return; }
            blockProcess = true;

            if (currentSection === 0) {
                $("#intro").addClass("overlay-active");
                setTimeout(function () { $("#overlay").addClass("open"); }, 200);
            }

            currentSection++;
            sections.removeClass("active");

            setTimeout(function () {
                sections.eq(currentSection - 1).addClass("active");
                $(".up-button").addClass("active");
                setTimeout(function () { blockProcess = false; }, 800);
            }, currentSection === 1 ? 600 : 400);
        }

        function prevSection() {
            if (blockProcess || currentSection === 0) { return; }
            blockProcess = true;
            currentSection--;
            sections.removeClass("active");

            if (currentSection === 0) {
                $(".up-button").removeClass("active");
                $("#overlay").removeClass("open");
                setTimeout(function () {
                    $("#intro").removeClass("overlay-active");
                    blockProcess = false;
                }, 800);
            } else {
                sections.eq(currentSection - 1).addClass("active");
                setTimeout(function () { blockProcess = false; }, 800);
            }
        }

        $(".go-down").click(nextSection);
        $(".go-up").click(prevSection);

        $("html").on("DOMMouseScroll mousewheel", function (e) {
            var delta = e.originalEvent.wheelDelta || (e.originalEvent.detail * -1);
            if (delta < 0) { nextSection(); } else { prevSection(); }
        });

        $(document).keydown(function (e) {
            if (e.which === 40) { nextSection(); e.preventDefault(); }
            if (e.which === 38) { prevSection(); e.preventDefault(); }
        });

        $(".social-icons li a").tooltip({ container: "body", delay: { show: 150, hide: 0 } });


        // ── 3. SUBSCRIBE FORM ─────────────────────────────────────────
        $(".subscribe-form").submit(function () {
            $.ajax({
                type: "POST", url: "assets/php/subscribe.php",
                data: $(".subscribe-form").serialize(), dataType: "json",
                success: function (json) {
                    $(".subscribe-form").removeClass("error error-final");
                    if (json.valid === 0) {
                        $(".subscribe-form").addClass("error");
                        $(".subscribe-form input").attr("placeholder", json.message).val("");
                        setTimeout(function () { $(".subscribe-form").addClass("error-final"); }, 1500);
                    } else {
                        $(".subscribe-form input, .subscribe-form button").val("").prop("disabled", true);
                        $(".subscribe-form input").attr("placeholder", json.message);
                        $(".subscribe-form").addClass("success");
                    }
                }
            });
            return false;
        });


        // ── 4. CONTACT FORM ───────────────────────────────────────────
        $("#contact-form").submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST", url: "assets/php/contact.php",
                data: $(this).serialize(), dataType: "json",
                success: function (json) {
                    $("#contact-form.error input, #contact-form.error textarea").removeClass("active");
                    setTimeout(function () {
                        if (json.nameMessage)    { $("#contact-form-name").addClass("active").attr("placeholder", json.nameMessage); $("#contact-form").addClass("error"); }
                        if (json.emailMessage)   { $("#contact-form-email").addClass("active").val("").attr("placeholder", json.emailMessage); $("#contact-form").addClass("error"); }
                        if (json.messageMessage) { $("#contact-form-message").addClass("active").attr("placeholder", json.messageMessage); $("#contact-form").addClass("error"); }
                    }, 50);
                    if (!json.nameMessage && !json.emailMessage && !json.messageMessage) {
                        $("#contact-form").removeClass("error").addClass("success");
                        $("#contact-form textarea").attr("placeholder", json.succesMessage);
                        $("#contact-form input, #contact-form button, #contact-form textarea").val("").prop("disabled", true);
                    }
                }
            });
        });
    });


    // ── 5. INTRO ANIMATION + TEXT CYCLE (window load) ────────────────
    $(window).on("load", function () {
        var dur = fadeDuration + "ms";

        // Remove loading screen
        $("#page-load").addClass("remove");

        // h1 elements start at opacity:0 via CSS; set them to 1 so they
        // show through their parent .slide when the slide fades in.
        $("#intro .slide h1").css({ transition: "opacity " + dur + " ease", opacity: 1 });

        // Staggered reveal of intro elements
        setTimeout(function () {
            $("#intro .logo").css({ transition: "opacity " + dur + " ease", opacity: 1 });
        }, 300);

        setTimeout(function () {
            $(".slider .slide").first().css({ transition: "opacity " + dur + " ease", opacity: 1 });
        }, 650);

        setTimeout(function () {
            $("#intro p").css({ transition: "opacity " + dur + " ease", opacity: 1 });
        }, 950);

        setTimeout(function () {
            $("#intro .arrow-wrap").css({ transition: "opacity " + dur + " ease", opacity: 1 });
        }, 1150);

        // Text slide cycle (cycling .slide opacity; h1 inside follows)
        if ($(".slider .slide").length > 1) {
            var slideIdx = 0;
            setInterval(function () {
                var $slides = $(".slider .slide");
                $slides.eq(slideIdx).animate({ opacity: 0 }, fadeDuration);
                slideIdx = (slideIdx + 1) % $slides.length;
                var nextIdx = slideIdx;
                setTimeout(function () {
                    $slides.eq(nextIdx).animate({ opacity: 1 }, fadeDuration);
                }, fadeDuration + 100);
            }, screenTime);
        }
    });

})(jQuery);
