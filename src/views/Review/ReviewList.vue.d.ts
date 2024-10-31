import type { Review } from '@/types/Review';
declare const _default: import("vue").DefineComponent<{}, {
    reviews: import("vue").Ref<{
        review_id: number;
        content: {
            readonly [x: number]: string;
            toString: () => string;
            charAt: (pos: number) => string;
            charCodeAt: (index: number) => number;
            concat: (...strings: string[]) => string;
            indexOf: (searchString: string, position?: number) => number;
            lastIndexOf: (searchString: string, position?: number) => number;
            localeCompare: {
                (that: string): number;
                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
            };
            match: {
                (regexp: string | RegExp): RegExpMatchArray | null;
                (matcher: {
                    [Symbol.match](string: string): RegExpMatchArray | null;
                }): RegExpMatchArray | null;
            };
            replace: {
                (searchValue: string | RegExp, replaceValue: string): string;
                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replaceValue: string): string;
                }, replaceValue: string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                }, replacer: (substring: string, ...args: any[]) => string): string;
            };
            search: {
                (regexp: string | RegExp): number;
                (searcher: {
                    [Symbol.search](string: string): number;
                }): number;
            };
            slice: (start?: number, end?: number) => string;
            split: {
                (separator: string | RegExp, limit?: number): string[];
                (splitter: {
                    [Symbol.split](string: string, limit?: number): string[];
                }, limit?: number): string[];
            };
            substring: (start: number, end?: number) => string;
            toLowerCase: () => string;
            toLocaleLowerCase: {
                (locales?: string | string[]): string;
                (locales?: Intl.LocalesArgument): string;
            };
            toUpperCase: () => string;
            toLocaleUpperCase: {
                (locales?: string | string[]): string;
                (locales?: Intl.LocalesArgument): string;
            };
            trim: () => string;
            readonly length: number;
            substr: (from: number, length?: number) => string;
            valueOf: () => string;
            codePointAt: (pos: number) => number | undefined;
            includes: (searchString: string, position?: number) => boolean;
            endsWith: (searchString: string, endPosition?: number) => boolean;
            normalize: {
                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                (form?: string): string;
            };
            repeat: (count: number) => string;
            startsWith: (searchString: string, position?: number) => boolean;
            anchor: (name: string) => string;
            big: () => string;
            blink: () => string;
            bold: () => string;
            fixed: () => string;
            fontcolor: (color: string) => string;
            fontsize: {
                (size: number): string;
                (size: string): string;
            };
            italics: () => string;
            link: (url: string) => string;
            small: () => string;
            strike: () => string;
            sub: () => string;
            sup: () => string;
            padStart: (maxLength: number, fillString?: string) => string;
            padEnd: (maxLength: number, fillString?: string) => string;
            trimEnd: () => string;
            trimStart: () => string;
            trimLeft: () => string;
            trimRight: () => string;
            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
            [Symbol.iterator]: () => StringIterator<string>;
        };
        point: number;
        latitude: number;
        longitude: number;
        created_at: Date;
        image_url: string;
        order_index: number;
        title: string;
        like_count: number;
        liked: boolean;
        comment_count: number;
        member: {
            login_id: string;
            name: string;
            profile_url: string;
        };
    }[], Review[] | {
        review_id: number;
        content: {
            readonly [x: number]: string;
            toString: () => string;
            charAt: (pos: number) => string;
            charCodeAt: (index: number) => number;
            concat: (...strings: string[]) => string;
            indexOf: (searchString: string, position?: number) => number;
            lastIndexOf: (searchString: string, position?: number) => number;
            localeCompare: {
                (that: string): number;
                (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
                (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
            };
            match: {
                (regexp: string | RegExp): RegExpMatchArray | null;
                (matcher: {
                    [Symbol.match](string: string): RegExpMatchArray | null;
                }): RegExpMatchArray | null;
            };
            replace: {
                (searchValue: string | RegExp, replaceValue: string): string;
                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replaceValue: string): string;
                }, replaceValue: string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                }, replacer: (substring: string, ...args: any[]) => string): string;
            };
            search: {
                (regexp: string | RegExp): number;
                (searcher: {
                    [Symbol.search](string: string): number;
                }): number;
            };
            slice: (start?: number, end?: number) => string;
            split: {
                (separator: string | RegExp, limit?: number): string[];
                (splitter: {
                    [Symbol.split](string: string, limit?: number): string[];
                }, limit?: number): string[];
            };
            substring: (start: number, end?: number) => string;
            toLowerCase: () => string;
            toLocaleLowerCase: {
                (locales?: string | string[]): string;
                (locales?: Intl.LocalesArgument): string;
            };
            toUpperCase: () => string;
            toLocaleUpperCase: {
                (locales?: string | string[]): string;
                (locales?: Intl.LocalesArgument): string;
            };
            trim: () => string;
            readonly length: number;
            substr: (from: number, length?: number) => string;
            valueOf: () => string;
            codePointAt: (pos: number) => number | undefined;
            includes: (searchString: string, position?: number) => boolean;
            endsWith: (searchString: string, endPosition?: number) => boolean;
            normalize: {
                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                (form?: string): string;
            };
            repeat: (count: number) => string;
            startsWith: (searchString: string, position?: number) => boolean;
            anchor: (name: string) => string;
            big: () => string;
            blink: () => string;
            bold: () => string;
            fixed: () => string;
            fontcolor: (color: string) => string;
            fontsize: {
                (size: number): string;
                (size: string): string;
            };
            italics: () => string;
            link: (url: string) => string;
            small: () => string;
            strike: () => string;
            sub: () => string;
            sup: () => string;
            padStart: (maxLength: number, fillString?: string) => string;
            padEnd: (maxLength: number, fillString?: string) => string;
            trimEnd: () => string;
            trimStart: () => string;
            trimLeft: () => string;
            trimRight: () => string;
            matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
            [Symbol.iterator]: () => StringIterator<string>;
        };
        point: number;
        latitude: number;
        longitude: number;
        created_at: Date;
        image_url: string;
        order_index: number;
        title: string;
        like_count: number;
        liked: boolean;
        comment_count: number;
        member: {
            login_id: string;
            name: string;
            profile_url: string;
        };
    }[]>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {
    ReviewItem: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        review: {
            type: import("vue").PropType<Review>;
            required: true;
        };
    }>, {
        formattedDate: import("vue").ComputedRef<string>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        review: {
            type: import("vue").PropType<Review>;
            required: true;
        };
    }>> & Readonly<{}>, {}, {}, {
        NonHeart: import("vue").DefineComponent<{}, {}, any>;
        More: import("vue").DefineComponent<{}, {}, any>;
        Chat: import("vue").DefineComponent<{}, {}, any>;
        Bookmark: import("vue").DefineComponent<{}, {}, any>;
        Location: import("vue").DefineComponent<{}, {}, any>;
    }, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Nav: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {
        Logo: import("vue").DefineComponent<{}, {}, any>;
        Home: import("vue").DefineComponent<{}, {}, any>;
        Search: import("vue").DefineComponent<{}, {}, any>;
        Message: import("vue").DefineComponent<{}, {}, any>;
        Write: import("vue").DefineComponent<{}, {}, any>;
        Profile: import("vue").DefineComponent<{}, {}, any>;
        Settings: import("vue").DefineComponent<{}, {}, any>;
    }, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
