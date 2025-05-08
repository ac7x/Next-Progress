import { tagUtil } from '@/modules/c-tag/infrastructure/tag-util';
export const tagDisplayUtils = {
    ...tagUtil,
    getTagTypeTextColor: tagUtil.getTagTypeTextColor,
    getTagTypeBorderColor: tagUtil.getTagTypeBorderColor,
};

