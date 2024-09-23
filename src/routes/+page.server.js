import fs from 'node:fs';
import path from 'path';

function getSvgImagesFromDir(type) {
    const directory = path.join('static','assets',type);
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.svg'));
    return files.map((file, index) => ({
        id: index + 1,
        src: `assets/${type}/${file}`
    }));
}

export async function load() {

    const accessoriesStyleImages = getSvgImagesFromDir('accessories');
    const eyesStyleImages = getSvgImagesFromDir('eyes');
    const hairStyleImages = getSvgImagesFromDir('hair');
    const headStyleImages = getSvgImagesFromDir('head');
    const mouthStyleImages = getSvgImagesFromDir('mouth');
    const outfitStyleImages = getSvgImagesFromDir('outfit');

    // Return the lists of images to the +page.svelte component
    return {
        accessoriesStyleImages,
        eyesStyleImages,
        hairStyleImages,
        headStyleImages,
        mouthStyleImages,
        outfitStyleImages,
    };
}
