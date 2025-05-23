import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function About() {
    return (
        <>
            <Head title="About - OSAS Connect">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader />

                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90"></div>

                            {/* Background pattern/texture */}
                            <div className="absolute inset-0 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                    <pattern id="pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                        <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                    </pattern>
                                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                                </svg>
                            </div>                            <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                                <div className="text-center">
                                    <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12]">
                                        Our Story
                                    </div>
                                    <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        About OSAS Connect
                                    </h1>
                                    <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                                        Empowering students through accessible scholarship opportunities and streamlined management
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Our Mission Section */}
                        <section className="mt-16 py-16">
                            <div className="grid gap-12 md:grid-cols-2 items-center">
                                <div>
                                    <div className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                        Our Mission
                                    </div>
                                    <h2 className="text-3xl font-bold text-[#005a2d]">Bridging the Gap Between Students and Opportunities</h2>
                                    <p className="mt-6 text-lg text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        At OSAS Connect, we believe that financial constraints should never limit a student's educational aspirations. Our mission is to democratize access to scholarships by creating a centralized, user-friendly platform that connects deserving students with funding opportunities.
                                    </p>
                                    <p className="mt-4 text-lg text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        Through innovative technology and streamlined processes, we're breaking down barriers and simplifying what was once a complex, time-consuming application journey.
                                    </p>

                                    <div className="mt-8">
                                        <Link
                                            href="/scholarships/available"
                                            className="rounded-md bg-[#005a2d] px-8 py-3 text-center font-medium text-white shadow-md transition-all hover:bg-[#004020] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#005a2d] focus:ring-offset-2"
                                        >
                                            Explore Scholarships
                                        </Link>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl bg-[#febd12]/20"></div>
                                    <div className="absolute -right-4 -bottom-4 h-full w-full rounded-3xl bg-[#005a2d]/20"></div>
                                    <img
                                        src="https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green-wall_651396-1833.jpg"
                                        alt="OSAS Connect Mission"
                                        className="relative z-10 w-full rounded-3xl object-cover shadow-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://placehold.co/600x400/005a2d/FFFFFF?text=OSAS+CONNECT";
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Our Vision Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                                    Our Vision
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">A Future Where Every Student Can Thrive</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    We envision a world where financial barriers no longer prevent talented students from achieving their educational dreams
                                </p>
                            </div>

                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Vision point 1 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#005a2d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#005a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Making Scholarships Accessible</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        Creating a world where all students can easily find and apply for scholarships that match their qualifications and aspirations.
                                    </p>
                                </div>

                                {/* Vision point 2 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#005a2d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#005a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Fostering Educational Equity</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        Building systems that promote fairness and equality in educational opportunities regardless of socioeconomic background.
                                    </p>
                                </div>

                                {/* Vision point 3 */}
                                <div className="rounded-lg bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-[#1a1a1a]">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#005a2d]/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#005a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-[#005a2d]">Technology-Driven Solutions</h3>
                                    <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                        Leveraging innovative technology to simplify complex processes and create intuitive user experiences for all stakeholders.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Team Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                                    Our Leadership
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Meet the Team Behind OSAS Connect</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    Dedicated professionals committed to transforming scholarship management
                                </p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Team Member 1 */}
                                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">                                <div className="h-64 overflow-hidden">
                                    <img
                                        src="https://placehold.co/300x300/005a2d/FFFFFF?text=LEODYVER"
                                        alt="Leodyver S. Semilla"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-[#005a2d]">Leodyver S. Semilla</h3>
                                        <p className="text-sm text-[#febd12] font-medium">Lead Developer</p>
                                        <p className="mt-3 text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                            The primary developer responsible for building and implementing the entire OSAS Connect system software.
                                        </p>
                                    </div>
                                </div>

                                {/* Team Member 2 */}
                                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">                                <div className="h-64 overflow-hidden">
                                    <img
                                        src="https://placehold.co/300x300/005a2d/FFFFFF?text=RAESELL"
                                        alt="Raesell Ann Mangarin"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-[#005a2d]">Raesell Ann Mangarin</h3>
                                        <p className="text-sm text-[#febd12] font-medium">Documentation Lead</p>
                                        <p className="mt-3 text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                            Responsible for creating comprehensive documentation and providing system support for OSAS Connect.
                                        </p>
                                    </div>
                                </div>

                                {/* Team Member 3 */}
                                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">                                <div className="h-64 overflow-hidden">
                                    <img
                                        src="https://placehold.co/300x300/005a2d/FFFFFF?text=JAYVEE"
                                        alt="Jayvee Magnayee"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-[#005a2d]">Jayvee Magnayee</h3>
                                        <p className="text-sm text-[#febd12] font-medium">Documentation Support</p>
                                        <p className="mt-3 text-[#010002]/80 dark:text-[#f3f2f2]/80">
                                            Works on documentation and provides additional support for the OSAS Connect platform.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Organizational Chart Section */}
                        <section className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                                    Our Structure
                                </div>
                                <h2 className="text-3xl font-bold text-[#005a2d]">Organizational Chart</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                    How our team works together to serve the student community
                                </p>
                            </div>
                            <div className="mx-auto max-w-4xl">
                                {/* Level 1 - University President */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#004523] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://minsu.edu.ph/template/images/employee/key%20officials/apostol_enya.jpg"
                                                alt="Dr. Enya Marie D. Apostol"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/005a2d/FFFFFF?text=PRESIDENT";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2">Dr. Enya Marie D. Apostol</h4>
                                        <p className="text-base font-medium text-white/90">University President</p>
                                        <p className="text-sm text-white/75 mt-1">SUC President III</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>

                                {/* Level 2 - VP Academic Affairs */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#005a2d] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://minsu.edu.ph/template/images/employee/key%20officials/salazar_ciedelle.jpg"
                                                alt="Dr. Ciedelle P. Salazar"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/006d36/FFFFFF?text=VP";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2">Dr. Ciedelle P. Salazar</h4>
                                        <p className="text-base font-medium text-white/90">Vice President for Academic Affairs</p>
                                        <p className="text-sm text-white/75 mt-1">Academic Affairs Leadership</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>

                                {/* Level 3 - Campus Executive Director */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#006d36] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://minsu.edu.ph/template/images/employee/key%20officials/salazar_ciedelle.jpg"
                                                alt="Dr. Ciedelle P. Salazar"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/007f3f/FFFFFF?text=DIRECTOR";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2">Dr. Ciedelle P. Salazar</h4>
                                        <p className="text-base font-medium text-white/90">Campus Executive Director</p>
                                        <p className="text-sm text-white/75 mt-1">Bongabong Campus</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>

                                {/* Level 4 - OSAS Director */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#007f3f] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://minsu.edu.ph/template/images/employee/key%20officials/caoli_jonbert1.jpg"
                                                alt="Jonbert M. Caoli"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/23b14d/FFFFFF?text=OSAS";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2">Jonbert M. Caoli</h4>
                                        <p className="text-base font-medium text-white/90">Director, Student Affairs and Services</p>
                                        <p className="text-sm text-white/75 mt-1">Office of Student Affairs and Services</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>

                                {/* Level 5 - OSAS Coordinator */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#009148] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/499538815_3139584229529008_529685815103046574_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFy-p85pppEJfDtyPt3eJGqolGMGeS2jvaiUYwZ5LaO9pV4n-w43TDy92z604SLxVAW358eZX7NdGSulYx6m6Ds&_nc_ohc=rEefjkOJ5JwQ7kNvwHURCY_&_nc_oc=AdlB42KPwi1OR2SYZp-gpmOCOdd4Dr3ASsVEx5HIs1GYBfSDFWJ1wa9qxwyNOzyZZss&_nc_zt=23&_nc_ht=scontent.fmnl17-2.fna&_nc_gid=Q6rU3lSOhrGPYWd2pe6JpA&oh=00_AfLnZ_-pTb6AP4r1jB_wwQW5aj0beQW5XPpLH0-89few8g&oe=68367CA2"
                                                alt="Dr. Dionisio E. Briñosa"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/26b853/FFFFFF?text=COORDINATOR";
                                                }}
                                            />
                                        </div>                                        <h4 className="font-bold text-xl mb-2">Dr. Dionisio E. Briñosa</h4>
                                        <p className="text-base font-medium text-white/90">Coordinator, Office of Student Affairs and Services</p>
                                        <p className="text-sm text-white/75 mt-1">Bongabong Campus</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>

                                {/* Level 6 - Scholarship Coordinator */}
                                <div className="flex justify-center mb-12">
                                    <div className="w-96 p-6 bg-[#00a352] rounded-xl text-center text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                                        <div className="h-28 w-28 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 shadow-inner">
                                            <img
                                                src="https://scontent.fmnl17-8.fna.fbcdn.net/v/t1.6435-1/62021920_2573218819389782_451695487112708096_n.jpg?stp=c0.0.575.575a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeE8x3yFeZ7cVf8tutRuf7mwbbd5LXNMHIptt3ktc0wcip4SSthG6exNN1kpGMeIdApcP3RE13eoHNopaVN7bLwW&_nc_ohc=mz7_41UhK2UQ7kNvwEHPA4o&_nc_oc=AdmMn-PyETTmZesEu_MkgukobEfnaYQf0lvRwcmRiCIVHETfHo4Lgi0dl7a_d-d6neg&_nc_zt=24&_nc_ht=scontent.fmnl17-8.fna&_nc_gid=psoPlVNAn7PFEdgeorVChg&oh=00_AfKOO3E7aj7vt1i1bqCtEDxUWi-4CsgkKRbHq4ms2hNuaw&oe=68581156"
                                                alt="Nicko A. Magnaye"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/28c959/FFFFFF?text=COORDINATOR";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-xl mb-2">Nicko A. Magnaye</h4>
                                        <p className="text-base font-medium text-white/90">Scholarship Coordinator</p>
                                        <p className="text-sm text-white/75 mt-1">Scholarship Program Management</p>
                                    </div>
                                </div>

                                {/* Vertical Line with decorative elements */}
                                <div className="relative h-12 mb-12">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#005a2d] to-transparent"></div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#005a2d] rounded-full"></div>
                                </div>
                                {/* Bottom Level - Multiple Boxes */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                                    {/* Box 1 */}
                                    <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#febd12]/20">
                                        <div className="h-36 w-36 mx-auto overflow-hidden rounded-full border-4 border-[#febd12]/20 shadow-inner">
                                            <img
                                                src="https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF1"
                                                alt="OSAS Staff - Scholarship Processing"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF1";
                                                }}
                                            />
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h4 className="font-bold text-lg text-[#005a2d]">Ma. Cristina P. Lumauig</h4>
                                            <p className="text-sm text-[#febd12] font-medium mt-2">OSAS Staff</p>
                                            <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70 mt-2">Scholarship Processing</p>
                                        </div>
                                    </div>

                                    {/* Box 2 */}
                                    <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#febd12]/20">
                                        <div className="h-36 w-36 mx-auto overflow-hidden rounded-full border-4 border-[#febd12]/20 shadow-inner">
                                            <img
                                                src="https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF2"
                                                alt="OSAS Staff - Documentation & Records"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF2";
                                                }}
                                            />
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h4 className="font-bold text-lg text-[#005a2d]">John Doe</h4>
                                            <p className="text-sm text-[#febd12] font-medium mt-2">OSAS Staff</p>
                                            <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70 mt-2">Documentation & Records</p>
                                        </div>
                                    </div>

                                    {/* Box 3 */}
                                    <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#febd12]/20">
                                        <div className="h-36 w-36 mx-auto overflow-hidden rounded-full border-4 border-[#febd12]/20 shadow-inner">
                                            <img
                                                src="https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF3"
                                                alt="OSAS Staff - Student Support"
                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/300x300/005a2d/FFFFFF?text=STAFF3";
                                                }}
                                            />
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h4 className="font-bold text-lg text-[#005a2d]">Jane Smith</h4>
                                            <p className="text-sm text-[#febd12] font-medium mt-2">OSAS Staff</p>
                                            <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70 mt-2">Student Support Services</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contact CTA Section */}
                        <section className="mt-16 mb-8">
                            <div className="rounded-2xl bg-gradient-to-r from-[#005a2d] to-[#008040] p-8 shadow-xl overflow-hidden relative">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                        <pattern id="pattern-circles-cta" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                                        </pattern>
                                        <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
                                    </svg>
                                </div>

                                <div className="relative z-10 text-center">
                                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                        Ready to Unlock Your Potential?
                                    </h2>
                                    <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
                                        Join OSAS Connect today and take the first step towards a brighter academic and professional future.
                                    </p>

                                    <div className="mt-8 flex justify-center gap-4">
                                        <Link
                                            href="/register"
                                            className="rounded-md bg-white px-6 py-3 text-center font-medium text-[#005a2d] shadow-md transition-all hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            Get Started
                                        </Link>
                                        <Link
                                            href="/scholarships/available"
                                            className="rounded-md bg-[#febd12] px-6 py-3 text-center font-medium text-[#010002] shadow-md transition-all hover:bg-[#f3bd07] focus:outline-none focus:ring-2 focus:ring-[#febd12] focus:ring-offset-2"
                                        >
                                            Explore Scholarships
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer Component */}
                <SiteFooter />
            </div>
        </>
    );
}
