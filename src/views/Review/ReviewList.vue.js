import { defineComponent, ref } from 'vue';
import ReviewItem from '@/components/Review/ReviewItem.vue';
import Nav from '@/components/common/Nav.vue';
export default defineComponent({
    components: { ReviewItem, Nav },
    setup() {
        const reviews = ref([
            {
                review_id: 1,
                content: '정말 좋아요!',
                point: 5,
                latitude: 37.5665,
                longitude: 126.978,
                created_at: new Date('2024-10-31T12:34:56'),
                image_url: 'https://i.pinimg.com/564x/95/6a/de/956ade4ba29c2351f66c6c9ea982aaa3.jpg',
                order_index: 0,
                title: '부산역',
                like_count: 10,
                liked: false,
                comment_count: 3,
                member: {
                    login_id: 'hong',
                    name: '홍길동',
                    profile_url: 'https://i.pinimg.com/736x/03/57/fe/0357fe68523f7c5d76ea5c6fff3e24de.jpg',
                },
            },
            {
                review_id: 2,
                content: '가격 대비 만족합니다.',
                point: 4,
                latitude: 37.567,
                longitude: 126.979,
                created_at: new Date('2024-10-31T12:34:56'),
                image_url: 'https://i.pinimg.com/564x/95/6a/de/956ade4ba29c2351f66c6c9ea982aaa3.jpg',
                order_index: 0,
                title: '구미역',
                like_count: 1000,
                liked: true,
                comment_count: 300,
                member: {
                    login_id: 'park',
                    name: '이순신',
                    profile_url: 'https://i.pinimg.com/736x/03/57/fe/0357fe68523f7c5d76ea5c6fff3e24de.jpg',
                },
            },
        ]);
        return { reviews };
    },
}); /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{ ReviewItem, Nav },
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex h-screen") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Nav;
    /** @type { [typeof __VLS_components.Nav, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("w-1/4 h-screen") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("w-1/4 h-screen") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("w-3/4 overflow-y-scroll") }, });
    for (const [review] of __VLS_getVForSourceType((__VLS_ctx.reviews))) {
        const __VLS_6 = __VLS_resolvedLocalAndGlobalComponents.ReviewItem;
        /** @type { [typeof __VLS_components.ReviewItem, ] } */
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ key: ((review.review_id)), review: ((review)), }));
        const __VLS_8 = __VLS_7({ key: ((review.review_id)), review: ((review)), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    }
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['h-screen'];
    __VLS_styleScopedClasses['w-1/4'];
    __VLS_styleScopedClasses['h-screen'];
    __VLS_styleScopedClasses['w-3/4'];
    __VLS_styleScopedClasses['overflow-y-scroll'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
let __VLS_self;
