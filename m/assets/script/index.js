/*
    index.js
*/

function PageIndex() {
    const _ = this;
    _.element = {
        body: $('html,body'),
        root: $('#wakeoneHome'),
        footer: $('.footer'),
        gnbLink: $('.menu-open__link'),
        gnbMenu: $('.header__menu'),
        gnbMenuLink: $('.header__menu .menu__gnb .gnb__item a, .header__menu .menu-logo__link'),
        gnbMenuCloseBtn: $('.gnb-close__link'),
        backgroundvideoWrap: $('.bg-video'),
        backgroundVideo: $('#videoMain'),
        sectionVisual: $('.section--visual'),
        storeLinkGoogle: $('[data-store="google"]'),
        storeLinkApp: $('[data-store="app"]'),
        artistDetailSwiperWrap: $('.modal--artist .swiper'),
        artistOpened: $('.section--artist .artist__link:not([disabled])'),
        modal: {
            wrapper: $('.modal'),
            alert: $('.modal--alert'),
            artist: $('.modal--artist'),
            ended: $('.modal--ended')
        },
        modalArtistDetail: $('.modal--artist .artist-item'),
        modalArtistCloseBtn: $('.modal--artist .modal-close__btn'),
        modalCloseBtn: $('.modal--alert .btn-confirm'),
        langSelectBtn: $('.header__util .lang__link'),
        langSelectList: $('.header__util .select-lang'),
        gotopBtn: $('.gotop__link,.header-logo__link')
    };

    _.userAgent = navigator.userAgent;

    _.videoList = ['./assets/video/main/mv1_shorts.mp4', './assets/video/main/mv2_shorts.mp4', './assets/video/main/mv3_shorts.mp4'];

    //swiper
    _.swiper = {
        artist: null
    };

    //screen height view
    _.viewHeight = 0;

    //modal
    _.modal = {
        artist: null,
        alert: function (dataText) {
            gnbFixed();
            _.element.modal.alert.find('.alert__msg').html(dataText.textMsg);
            _.element.modal.alert.find('.btn-confirm .text').text(dataText.textConfirm);
            _.element.modal.alert.addClass('modal--on');
        },
        ended: function (dataText) {
            gnbFixed();
            _.element.modal.ended.find('.alert__msg').html(dataText.textMsg);
            _.element.modal.ended.find('.btn-confirm .text').text(dataText.textConfirm);
            _.element.modal.ended.addClass('modal--on');
        }
    };

    // 메인화면 브라우저 100% 높이값 설정
    // 모바일 브라우저 상태창에 따라 비율이 달라짐을 방지하여 최초 1회만 설정
    function setviewHeight() {
        _.viewHeight = window.innerHeight;

        _.element.sectionVisual.css('height', _.viewHeight + 'px');
    }

    // 메인 비디오 랜덤 재생
    function setVideoPlay() {
        var videoElement = _.element.backgroundVideo[0];
        const videoSel = Math.floor(Math.random() * _.videoList.length);
        console.log(videoElement);
        $(videoElement).attr('src', _.videoList[videoSel]);

        $(videoElement).on('loadedmetadata', function () {
            videoElement.muted = true;
            videoElement.play();
            setTimeout(() => {
                _.element.backgroundvideoWrap.addClass('on');
            }, 100);
        });
        $(videoElement).on('ended', function () {
            videoElement.play();
        });

        _.element.backgroundVideo.load();
    }

    // 접속 환경별 구글, 앱 스토어 버튼 노출
    function setStoreBtn() {
        if (/iPad|iPhone|iPod/.test(_.userAgent) || /Macintosh/.test(_.userAgent)) {
            _.element.storeLinkApp.css('display', 'block');
        } else {
            _.element.storeLinkGoogle.css('display', 'block');
        }
    }

    // 스토어 링크 맵핑
    function setStoreLink() {
        _.element.storeLinkGoogle.attr('href', storeLink.google);
        _.element.storeLinkApp.attr('href', storeLink.app);
    }

    // 아티스트 슬라이드
    function setArtistSlide(initialSlide) {
        _.swiper.artist = new Swiper('.modal--artist .swiper', {
            navigation: {
                nextEl: '.artist-detail .swiper-nav__link--next',
                prevEl: '.artist-detail .swiper-nav__link--prev'
            },
            initialSlide: initialSlide,
            slidesPerView: 1,
            loop: true,
            on: {
                slideChangeTransitionStart: function () {
                    artistPause();
                },
                slideChangeTransitionEnd: function () {
                    artistPlay();
                },
                afterInit: function () {
                    artistPlay();
                }
            }
        });
    }
    // 영상 일괄 일시 중지
    function artistPause() {
        if (_.swiper.artist) {
            $('.artist-item').each(function (index, item) {
                const video = $(item).find('video')[0];
                video.pause();
                video.loop = false;
                video.muted = true;
                video.currentTime = 0;
            });
        }
    }
    // 영상 재생
    function artistPlay() {
        const video = $('.artist-item.swiper-slide-active').find('video')[0];
        video.load();
        video.loop = true;
        video.play();
        video.muted = false;
    }

    // 아티스트 오픈
    function onClickArtistOpened() {
        const slectedIndex = $(this).closest('li').index();
        const activeArtistLength = _.element.artistOpened.length;

        if (activeArtistLength < 2) {
            $('.swiper-nav').hide();
        }

        _.element.modalArtistDetail.each(function (i) {
            if (i < activeArtistLength) {
                $(this).addClass('swiper-slide');
            } else {
                $(this).hide();
            }
        });

        _.element.modal.artist.addClass('modal--on');
        setArtistSlide(slectedIndex);
        gnbFixed();
    }

    // 아티스트 모달 close
    function onClickModalArtistClose() {
        _.element.modal.wrapper.removeClass('modal--on');
        _.swiper.artist.destroy();
        _.element.modalArtistDetail.removeClass('swiper-slide').show();
        gnbFixedClear();
        artistPause();
    }

    // 모달 close
    function onClickModalClose() {
        _.element.modal.wrapper.removeClass('modal--on');
        gnbFixedClear();
    }

    // 달성 보상 완료 처리
    function setViewRewardStep() {
        let stepIndex = setRewardStep || 0;
        $(`.preorder-reward__list li:lt(${stepIndex})`).addClass('complete');
    }

    // 언어선택상자
    function onClickSelectLang() {
        _.element.langSelectList.toggleClass('select-lang--on');
    }

    // 도큐먼트 클릭 이벤트
    function onClickDocument(e) {
        // 언어 선택상자 닫기
        if (_.element.langSelectBtn.has(e.target).length === 0) {
            _.element.langSelectList.removeClass('select-lang--on');
        }
    }

    let pageOffsetY = null;
    /* body - fixed 처리 */
    function gnbFixed() {
        pageOffsetY = window.pageYOffset;
        _.element.body.addClass('page--fixed').css('top', -pageOffsetY);
    }

    /* body - fixed 해제 처리 */
    function gnbFixedClear() {
        _.element.body.removeClass('page--fixed').css('top', '');
        window.scrollTo(0, pageOffsetY);
    }

    // gnb open
    function onClickGnbOpened() {
        gnbFixed();
        _.element.gnbMenu.addClass('header__menu--open');
    }
    // gnb close
    function onClickGnbClosed() {
        gnbFixedClear();
        _.element.gnbMenu.removeClass('header__menu--open');
    }

    // top 버튼
    function onClickGoTop(event) {
        _.element.body.animate({ scrollTop: 0 }, 500);

        event.preventDefault();
    }

    // top 버튼 노출
    function isVisibleGoTop() {
        let currentScroll = $(window).scrollTop();
        let containerHeight = parseInt(_.element.root.outerHeight());
        let footHeight = parseInt(_.element.footer.outerHeight());

        // 스크롤 footer 이하로는 고정
        if (currentScroll + _.viewHeight <= containerHeight - footHeight) {
            _.element.gotopBtn.parent().removeClass('fixed');
        } else {
            _.element.gotopBtn.parent().addClass('fixed');
        }

        // 스크롤 상단에선 사라지기
        if (currentScroll > _.viewHeight) {
            _.element.gotopBtn.parent().addClass('active');
        } else {
            _.element.gotopBtn.parent().removeClass('active');
        }
    }

    // 스크롤 시 메뉴 활성화
    function isActiveSection() {
        let scrollPosition = $(window).scrollTop();
        let windowHeight = $(window).height();

        $('.section').each(function () {
            let sectionTop = $(this).offset().top;
            let sectionHeight = $(this).outerHeight();
            let sectionId = $(this).attr('id');
            let sectionEnterRatio = 0.7;

            // 섹션이 화면의 50% 이상 보일 때 활성화
            if (scrollPosition + windowHeight / 2 >= sectionTop && scrollPosition + windowHeight / 2 < sectionTop + sectionHeight) {
                $('.menu__gnb .gnb__item a').removeClass('active');
                $('.menu__gnb .gnb__item a[href="#' + sectionId + '"]').addClass('active');
            }

            // 섹션이 하단에서 30% 노출되는 시점 감지
            if (scrollPosition + windowHeight * sectionEnterRatio >= sectionTop) {
                $(this).addClass('section--on');
            } else {
                $(this).removeClass('section--on');
            }
        });
    }

    // 메뉴 클릭
    function onClickGnbMenu(event) {
        event.preventDefault();
        onClickGnbClosed();

        let targetSection = $(this).attr('href');
        _.element.body.animate(
            {
                scrollTop: $(targetSection).offset().top - 50
            },
            500
        );
    }

    // 스크롤 이벤트
    function onScrollWindow() {
        isVisibleGoTop();
        isActiveSection();
    }

    // init
    (function () {
        setVideoPlay();
        setStoreBtn();
        setviewHeight();
        setStoreLink();
        setViewRewardStep();
        _.element.gnbLink.on('click', onClickGnbOpened);
        _.element.gnbMenuCloseBtn.on('click', onClickGnbClosed);
        _.element.artistOpened.on('click', onClickArtistOpened);
        _.element.modalArtistCloseBtn.on('click', onClickModalArtistClose);
        _.element.modalCloseBtn.on('click', onClickModalClose);
        _.element.langSelectBtn.on('click', onClickSelectLang);
        _.element.gotopBtn.on('click', onClickGoTop);
        _.element.gnbMenuLink.on('click', onClickGnbMenu);

        $(document).on('click', onClickDocument);
        $(window).on('scroll resize load', onScrollWindow);
    })();
}

$(document).ready(function () {
    window.sswo = window.sswo || {};

    window.sswo.ui = new PageIndex();
});
