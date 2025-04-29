import React from "react";
import Link from "next/link";

const aboutStyles = {
    container: {
        backgroundColor: "#45226e",
    },
    title: "text-white text-4xl font-bold leading-normal lg:text-start text-center",
    description: "text-white text-base font-normal leading-relaxed lg:text-start text-center",
    button: "sm:w-fit w-full px-3.5 py-2 bg-[#45226e] hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg border-2 border-white justify-center items-center flex",
    image: "lg:mx-0 mx-auto h-full rounded-3xl object-cover",
};

export const About = () => {
    return (
        <section
            style={aboutStyles.container}
            className="py-24 relative"
        >
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                    {/* Text Section */}
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                            <h2 className={aboutStyles.title}>
                                About Recommend Trend 
                            </h2>
                            <p className={aboutStyles.description}>
                                Discover Fashion Through Artificial Intelligence. At Recommend Trend, we've created a revolutionary way to find outfit inspiration using cutting-edge technology. Our system acts like your personal fashion assistant, analyzing your clothing photos to suggest stunning similar styles from Pinterest and shoppable accessories from top retailers.
                            </p>
                        </div>

                        {/* How It Works Section */}
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                            <h3 className="text-white text-2xl font-bold lg:text-start text-center">
                                How It Works ✨
                            </h3>
                            <p className={aboutStyles.description}>
                                <strong>Snap & Upload:</strong> Share a photo of your outfit or an inspiring look.
                            </p>
                            <p className={aboutStyles.description}>
                                <strong>AI Magic Happens:</strong> Our system:
                                <ul className="list-disc list-inside">
                                    <li>Identifies your outfit's key elements</li>
                                    <li>Finds visually similar Pinterest fashion pins</li>
                                    <li>Detects matching jewelry and accessories</li>
                                </ul>
                            </p>
                            <p className={aboutStyles.description}>
                                <strong>Get Inspired:</strong> Receive:
                                <ul className="list-disc list-inside">
                                    <li>Curated outfit recommendations</li>
                                    <li>Direct links to purchase similar items</li>
                                    <li>Complete styling ideas</li>
                                </ul>
                            </p>
                        </div>

                        {/* Why We Built This Section */}
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                            <h3 className="text-white text-2xl font-bold lg:text-start text-center">
                                Why We Built This 💡
                            </h3>
                            <p className={aboutStyles.description}>
                                As fashion lovers and tech innovators, we wanted to solve three common problems:
                            </p>
                            <ul className="list-disc list-inside text-white text-base font-normal leading-relaxed lg:text-start text-center">
                                <li>"I love this outfit but can't find similar pieces"</li>
                                <li>"Where can I buy accessories that match this style?"</li>
                                <li>"How can I recreate this Pinterest look affordably?"</li>
                            </ul>
                        </div>

                        {/* Get More Button */}
                        <Link href="/upload" className="w-full flex justify-center items-center">
                            <button className={aboutStyles.button}>
                                <span className="px-1.5 text-white text-sm font-medium leading-6">Get More</span>
                            </button>
                        </Link>
                    </div>

                    {/* Image Section */}
                    <img
                        className={aboutStyles.image}
                        src="/Upload-Image2.png"
                        alt="About Us"
                    />
                </div>
            </div>
        </section>
    );
};
