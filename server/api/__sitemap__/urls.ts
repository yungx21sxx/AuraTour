import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'
import {prisma} from "~~/server/service/prisma.service";

export default defineSitemapEventHandler(async () => {

    const [pages, listings, cities] = await Promise.all([
        prisma.seoPage.findMany(),
        prisma.listing.findMany({
            where: {
                rooms: {
                    some: {}
                }
            }
        }),
        prisma.city.findMany({
           where: {
               seoPages: {
                   none: {},
               },
               listings: {
                   some: {}
               }
           }
        })
    ])

    return [
        ...pages.map(page => ({
            loc: page.path,
            priority: page.priority,
            lastmod: page.lastModified,
            changefreq:  page.changefreq,
        } satisfies SitemapUrl)),
        ...listings.map(listing => ({
            loc: `/listing/${listing.id}`,
            priority: 0.5,
            lastmod: listing.createdAt,
            changefreq:  'monthly',
        } satisfies SitemapUrl)),
        ...cities.map(city => ({
            loc: `/search/city/${city.slug}`,
            priority: 0.8,
            changefreq:  'weekly',
        } satisfies SitemapUrl)),
    ]
})