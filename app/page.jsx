// app/page.jsx
import Banner from '../components/Banner';
import OpenSpheres from '../components/OpenSpheres';
import ServiceIntro from '../components/ServiceIntro';
import PartnersList from '../components/PartnersList';

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center max-w-[500px] mx-auto tracking-tighter">
            <main className="flex-grow w-full">
                <Banner />
                <OpenSpheres />
                <ServiceIntro />
                <PartnersList />
            </main>
        </div>
    );
}
