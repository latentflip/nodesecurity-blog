---
date: "2013-04-21 00:48:00 GMT"
slug: logistics
tumblr_post_url: "http://blog.nodesecurity.io/post/48482636726/logistics"
tags: 
  - kickoff
  - logistics
  - process
title: Logistics
type: text
---
So here are a few logistical things for people interested in the project.

Anybody wanting in on auditing some code and pushing out some advisories should join the [nodesecurity-auditors](https://groups.google.com/group/nodesecurity-auditors) group. This as well as our IRC channel (\#nodesecurity on freenode) will be the communication channels for coordinating audit initiatives.

At this point here are how things are going to work process wise. This will change but for those asking here it is.

1. An initiative will be decided upon amongst the team. An initiative is our focused pattern search across the code base. Because we can't do all the things on all the things, we are taking the approach of looking for one classification or type of bug across the entire module base.  
  
2. "The machine" \* will generate tickets for auditors to process. Tickets are intended to hold all the information necessary to the hotspot in question, such as the line(s) of code in question, module name, version, filenames etc.  
  
Currently we are using github issues on a private repository to manage this. We will probably end up with a custom portal at some point but this is what we have for now.  
  
3. Auditors are welcome to grab and work through those tickets, confirming or rejecting the machines recommendation.  
  
4. Peer review happens to confirm bug / vulnerability findings.  
  
5. Advisory details are written up in draft form and [CVE](http://cve.mitre.org/) numbers requested.  
  
6. The module owner is notified of finding. If a module owner does not respond within some yet to be determined time frame it is our goal to get some node programmers involved to try and send a pull request or have a patch available for public release of the advisory.  
  
7. Advisory details and finalize and pushed out to the public advisory database. An announcement on [nodesecurity-announce](https://groups.google.com/group/nodesecurity-announce) list is made as well.  
  
8. There is no step 8, although there probably should be.

\* The machine is the name we are giving the caveman like process we are using to find these things. This will refine over time given feedback from auditors, false positives, etc.

  
ps. The first security advisories will be going out next week.