import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH = 'isRefresh';
export const Refresh = () => SetMetadata(IS_REFRESH, true);
