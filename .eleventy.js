// -*- coding: utf-8; tab-width: 2 -*-

import { HtmlBasePlugin, I18nPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import pluginRss from "@11ty/eleventy-plugin-rss";

import { DateTime } from "luxon";

export const config = {
  dir: {
    data: "../data",
    includes: "../includes",
    input: "src/site",
    layouts: "../layouts",
    output: "dist",
  },
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    css: "/css/",
    js: "/js/",
    "src/static": "/",
  });

  eleventyConfig.addWatchTarget("css/*.css");

  eleventyConfig.addPlugin(HtmlBasePlugin, {
    baseHref: "https://jstvsolutions.com/",
    extensions: false,
  });

  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en", // Required
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("matchPageLang", function (collection) {
    return collection.filter((item) => {
      return this.page.lang === item.page.lang;
    });
  });

  eleventyConfig.addFilter("siteLangs", function (collection) {
    return Array.from(
      collection
        .map((item) => item.data.page.lang)
        .reduce((set, lang) => set.add(lang), new Set()),
    );
  });

  eleventyConfig.addFilter("tagsByLang", function (collection, langs) {
    return langs.reduce((accum, lang) => {
      const tags = collection
        .filter((item) => item.data.page.lang === lang && !!item.data.tags)
        .map((item) => item.data.tags)
        .flat();
      accum[lang] = Array.from(new Set(Array.isArray(tags) ? tags : [tags]));
      return accum;
    }, {});
  });

  eleventyConfig.addFilter("sortPages", function (collection) {
    return (collection || []).sort((item1, item2) => {
      return item1.page.url.localeCompare(item2.page.url);
    });
  });

  eleventyConfig.addFilter("filterTags", function (tags) {
    return (tags || []).filter((tag) => {
      return ["all", "posts"].indexOf(tag) === -1;
    });
  });

  eleventyConfig.addFilter("sortAlphabetically", function (strings) {
    return (strings || []).sort((b, a) => {
      return b.localeCompare(a);
    });
  });

  eleventyConfig.addFilter("htmlDateString", function (dateObj) {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy",
    );
  });
}
