---
date: "2014-02-01 10:17:11 GMT"
slug: "new-feature-validate-modules-with-npm-shrinkwrap"
tumblr_post_url: "http://blog.nodesecurity.io/post/75342048303/new-feature-validate-modules-with-npm-shrinkwrap"
tags: npm, confidential, publish, leak
title: "New Feature: Validate modules with npm shrinkwrap"
type: text
---

With the recent site update to hapi.js we tossed in a new feature.

One important aspect of the Node Security Project is to enable developers to know if modules they are using are vulnerable or if some sub dependencies are vulnerable.

To check your project execute the following

```bash
npm i

npm shrinkwrap; curl -X POST https://nodesecurity.io/validate/shrinkwrap -d @npm-shrinkwrap.json -H “content-type: application/json”
```

Obviously this is a bit of a crude interface, but it’s a starting point. Suggestions are welcome. Just start an issue and we’ll discuss there.

You can also check individual modules by version.

```bash
curl https://nodesecurity.io/validate/{module_name}/{version}
```

example:

```bash
curl https://nodesecurity.io/validate/marked/0.2.9

[{“title”:”Marked multiple content injection vulnerabilities”,”author”:”Adam Baldwin”,”module_name”:”marked”,”publish_date”:”Fri Jan 31 2014 00:33:12 GMT-0800 (PST)”,”cve”:”CVE-temp”,”vulnerable_versions”:”<0.3.0”,”patched_versions”:”>=0.3.0”, “url”:”marked_multiple_content_injection_vulnerabilities”}]
```
