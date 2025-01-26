import { createClient } from "../utils/supabase/server";
import Photo from "./Photo";


async function fetchUserPhotos(user) {
    const supabase = await createClient();

    if (!user) {
        return;
    }

    const folderPath = `user_uploads/${user.id}/`;
    const { data, error } = await supabase.storage
        .from('photos')
        .list(folderPath);

    if (error) {
        console.error('Error fetching photos', error);
        return;
    } 
    return data;
}

async function getPhotoUrls(photos, user) {
    const supabase = await createClient();

    return Promise.all(photos.map(async (photo) => {
        const { data, error } = await supabase.storage
            .from('photos')
            .createSignedUrl(`user_uploads/${user.id}/${photo.name}`, 60 * 60);

        if (error) {
            console.error('Error generating signed url', error);
            return;
        }
        return {url: data.signedUrl, photoName: photo.name}
    }));
}

async function fetchFavoritePhotos(user) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('favorites')
        .select('photo_name')
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching favorites", error);
    }
    return data.map((favorite) => favorite.photo_name);
}

export default async function PhotoGrid({ favorites = false }) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    const photos = await fetchUserPhotos(user);
    const photoObjects = await getPhotoUrls(photos, user);
    const favoritePhotoNames = await fetchFavoritePhotos(user);

    const photosWithFavorites = photoObjects.map((photo) => ({
        ...photo,
        isFavorited: favoritePhotoNames.includes(photo.photoName)
    }));

    const displayedPhotos = favorites 
        ? photosWithFavorites.filter(photo => photo.isFavorited) 
        : photosWithFavorites;

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {
                displayedPhotos.map((photo) => (
                    <Photo 
                        key={photo.photoName}
                        src={photo.url}
                        alt={`Photo ${photo.photoName}`}
                        width={200}
                        height={200}
                        photoName={photo.photoName}
                        isFavorited={photo.isFavorited}
                    />
                ))
            }

        </div>
    )
}