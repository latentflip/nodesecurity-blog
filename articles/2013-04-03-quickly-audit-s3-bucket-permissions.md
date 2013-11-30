#date: 2013-04-03 17:33:00 GMT
#slug: quickly-audit-s3-bucket-permissions
#tumblr_post_url: http://blog.liftsecurity.io/post/47033610732/quickly-audit-s3-bucket-permissions
#tags: Amazon, S3, Permissions
#title: Quickly Audit S3 Bucket Permissions
#type: text

One of my co-workers pointed me to an article about [scanning S3 for open buckets][0] and asked how our own S3 infrastructure looked. After reading about how easy it was, for anyone who wants to find, to discover and inspect S3 buckets in the wild in that post made me think about how hard it is to routinely audit S3 data.

At [^Lift Security][1] we are always looking to make sure that our site and it's data is secure -- just part of what we do.  But we also look to make or find tools that make good security part of the normal process, if it's tedius or hard then it's not followed up on.

A modern site is more likely to have static content hosted at a CDN or as "bucket" inside of Amazon's S3 service.  This increases the number of places you need to check and also increases the chance of accidents that lead to information leakage, or worse, leaks of keys or other authentication items

Making sure your S3 buckets are not accidentally open to the world is a tedious button-clicking process if you only have access or use the AWS S3 Console. Heck, even if you script it using something like the [Boto][2] library, you get an output that is not obvious or clear. This [Python][3]

> from boto.s3.connection import S3Connection  
> conn = S3Connection('<access key\>', '<secret key\>')  
> rs = conn.get\_all\_buckets()  
> for b in rs:  
> for grant in b.get\_acl().acl.grants:  
> print grant.permission, grant.display\_name
> 

generates output from the [Grant element][4] of a Boto Bucket:

> READ ops  
> WRITE ops  
> READ\_ACP ops  
> WRITE\_ACP ops  
> READ None
> 

not exactly helpful, especially that last line -- you have no idea that you have granted READ permission to AllUsers.

So [I][5] created a basic Python script named [s3scan][6] that loads your AWS credentials from a configuration file, calls S3 via boto for all of the known buckets and generates a summary of permissions:

> foo\_bucket ---  
> bar\_bucket --- Write: AuthenticatedUsers,owner  
> baz\_bucket --- Read: AllUsers,owner  
> bad\_bucket --- Write: AllUsers,owner  
> Read: AllUsers,owner  
> ACP Write: AllUsers,owner  
> ACP Read: AllUsers,owner
> 

foo\_bucket, bar\_bucket and baz\_bucket all display safe and/or sane buckets permissions, but the output for bad\_bucket should worry you.  The presence of any user id except your owner account in the ACP Read/Write output means your bucket is open.  ACP Write means that anyone can change the permissions for your bucket and then start uploading new items or even changing their content.

Now you should be able to quickly audit your S3 configuration from the command line without having to do a lot of button-mashing.  It would also be easy to adjust the output to generate keywords that could be grep'd for in a cronjob.  Pull requests accepted!

[0]: https://community.rapid7.com/community/infosec/blog/2013/02/14/1951-open-s3-bucket
[1]: http://liftsecurity.io
[2]: https://pypi.python.org/pypi/boto
[3]: http://python.org
[4]: http://boto.readthedocs.org/en/latest/ref/s3.html#module-boto.s3.bucket
[5]: https://twitter.com/bear "https://twitter.com/bear"
[6]: https://github.com/bear/s3scan "https://github.com/bear/s3scan"