import type { PropType } from 'vue';
import type { Review } from '@/types/Review';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    review: {
        type: PropType<Review>;
        required: true;
    };
}>, {
    formattedDate: import("vue").ComputedRef<string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    review: {
        type: PropType<Review>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {
    NonHeart: import("vue").DefineComponent<{}, {}, any>;
    More: import("vue").DefineComponent<{}, {}, any>;
    Chat: import("vue").DefineComponent<{}, {}, any>;
    Bookmark: import("vue").DefineComponent<{}, {}, any>;
    Location: import("vue").DefineComponent<{}, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
