import { resetStore } from '@sd/client';
import { proxy, useSnapshot } from 'valtio';
import { proxySet } from 'valtio/utils';

export type ExplorerLayoutMode = 'list' | 'grid' | 'media';

export enum ExplorerKind {
	Location,
	Tag,
	Space
}

const state = {
	locationId: null as number | null,
	path: '',
	layoutMode: 'grid' as ExplorerLayoutMode,
	toggleMenu: false as boolean,
	// Using gridNumColumns instead of fixed size. We dynamically calculate the item size.
	gridNumColumns: 3,
	listItemSize: 60,
	newThumbnails: proxySet() as Set<string>,
	// sorting
	// we will display different sorting options based on the kind of explorer we are in
	sortType: 'filePath' as 'filePath' | 'object' | 'ephemeral',
	orderKey: 'name',
	orderDirection: 'Asc' as 'Asc' | 'Desc'
};

export function flattenThumbnailKey(thumbKey: string[]) {
	return thumbKey.join('/');
}

const store = proxy({
	...state,
	reset: () => resetStore(store, state),
	addNewThumbnail: (thumbKey: string[]) => {
		store.newThumbnails.add(flattenThumbnailKey(thumbKey));
	},
	// this should be done when the explorer query is refreshed
	// prevents memory leak
	resetNewThumbnails: () => {
		store.newThumbnails.clear();
	}
});

/** for reading */
export const useExplorerStore = () => useSnapshot(store);
/** for writing */
export const getExplorerStore = () => store;
