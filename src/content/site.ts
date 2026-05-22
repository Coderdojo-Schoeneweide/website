// Site-wide settings and configuration
export interface SiteConfig {
    title: string
    description: string
    logo: {
        image: string
        text: string
        width: string
        height: string
    }
    contact: {
        email: string
        social: Array<{
            name: string
            url: string
        }>
    }
}

export const siteConfig: SiteConfig = {
    title: "CoderDojo Schöneweide",
    description: "Inspirierende IT-Workshops für Kinder und Jugendliche. Kostenlose Workshops im Bereich Informatik/Technik jeden zweiten Samstag von 11-13 Uhr.",
    logo: {
        image: "/images/logoP.png",
        text: "CoderDojo Schöneweide",
        width: "40",
        height: "40"
    },
    contact: {
        email: "hallo@coderdojo-schoeneweide.de",
        social: [
            {
                name: "Instagram",
                url: "https://www.instagram.com/dojosw/"
            },
            {
                name: "Facebook",
                url: "https://facebook.com/coderdojoschoeneweide"
            },
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/company/coderdojo-schöneweide-e-v"
            },

        ]
    }
}
