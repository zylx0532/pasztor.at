---
title: Can you use Gentoo as a Docker build system?
---

<!-- .slide: class="hero" -->

<div class="hero-logo">
    <img src="https://pasztor.at/assets/avatar.jpg" alt="" />
    <div class="hero-text">Janos Pasztor</div>
</div>

# Gentoo as a Docker build system

<small>A.K.A. Multi-Stage Builds are Cool</small>

---

<img src="A1_01_08RED_Digital_3_H.png" alt="" class="plain" />

---

<img src="exoscale.png" alt="" class="plain" />

---

<img src="datacenters.png" alt="" class="plain" />

---

<!-- .slide: class="full" -->

<img src="blog.png" alt="" class="plain" />

---

# pas**z**tor.at

---

# **👉** These are things to take home

---

# Can you use Gentoo as a Docker build system?

Yes<sup><strong>*</strong></sup>

<small><strong>*</strong> No</small>

---

# Why??

Just... why?

---

```
docker run -ti php
```

---

```
Interactive shell

php > var_dump(gd_info());
```

---

<pre class="console">
Warning: Uncaught Error: Call to undefined function gd_info() in php shell code:1
Stack trace:
#0 {main}
  thrown in php shell code on line 1
</pre>

---

<img src="breathe.jpg" alt="" class="plain" />

---

<img src="google.png" alt="" class="plain" />

---

```dockerfile
FROM php:7.2-fpm
RUN apt-get update && apt-get install -y \
		libfreetype6-dev \
		libjpeg62-turbo-dev \
		libpng-dev \
	&& docker-php-ext-install -j$(nproc) iconv \
	&& docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
	&& docker-php-ext-install -j$(nproc) gd
```

---

<img src="angry.jpg" alt="" class="plain" />

---

```dockerfile
FROM php:7.2-fpm
RUN apt-get update && apt-get install -y \
		libfreetype6-dev \
		libjpeg62-turbo-dev \
		libpng-dev \
	&& docker-php-ext-install -j$(nproc) iconv \
	&& docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
	&& docker-php-ext-install -j$(nproc) gd
```

---

# The Gentoo Build System

---

```bash
emerge --ask php
```

---

<pre class="console">
Calculating dependencies  ... done!
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">dev-libs/oniguruma-6.9.0</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-crnl-as-line-terminator</span> <span style="color:blue;font-weight:bold;">-static-libs</span>&quot; ABI_X86=&quot;(<span style="color:red;font-weight:bold;">64</span>) <span style="color:blue;font-weight:bold;">-32</span> (<span style="color:blue;font-weight:bold;">-x32</span>)&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">app-eselect/eselect-php-0.9.4-r5</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-apache2</span> <span style="color:blue;font-weight:bold;">-fpm</span>&quot; 
[<span style="color:green;font-weight:bold;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;font-weight:bold;">dev-lang/php-7.2.14</span>  USE=&quot;<span style="color:red;font-weight:bold;">acl</span> <span style="color:red;font-weight:bold;">berkdb</span> <span style="color:red;font-weight:bold;">bzip2</span> <span style="color:red;font-weight:bold;">cli</span> <span style="color:red;font-weight:bold;">ctype</span> <span style="color:red;font-weight:bold;">fileinfo</span> <span style="color:red;font-weight:bold;">filter</span> <span style="color:red;font-weight:bold;">gdbm</span> <span style="color:red;font-weight:bold;">hash</span> <span style="color:red;font-weight:bold;">iconv</span> <span style="color:red;font-weight:bold;">ipv6</span> <span style="color:red;font-weight:bold;">json</span> <span style="color:red;font-weight:bold;">nls</span> <span style="color:red;font-weight:bold;">opcache</span> <span style="color:red;font-weight:bold;">phar</span> <span style="color:red;font-weight:bold;">posix</span> <span style="color:red;font-weight:bold;">readline</span> <span style="color:red;font-weight:bold;">session</span> <span style="color:red;font-weight:bold;">simplexml</span> <span style="color:red;font-weight:bold;">ssl</span> <span style="color:red;font-weight:bold;">tokenizer</span> <span style="color:red;font-weight:bold;">unicode</span> <span style="color:red;font-weight:bold;">xml</span> <span style="color:red;font-weight:bold;">zlib</span> <span style="color:blue;font-weight:bold;">-apache2</span> <span style="color:blue;font-weight:bold;">-argon2</span> <span style="color:blue;font-weight:bold;">-bcmath</span> <span style="color:blue;font-weight:bold;">-calendar</span> <span style="color:blue;font-weight:bold;">-cdb</span> <span style="color:blue;font-weight:bold;">-cgi</span> <span style="color:blue;font-weight:bold;">-cjk</span> <span style="color:blue;font-weight:bold;">-coverage</span> <span style="color:blue;font-weight:bold;">-curl</span> <span style="color:blue;font-weight:bold;">-debug</span> <span style="color:blue;font-weight:bold;">-embed</span> <span style="color:blue;font-weight:bold;">-enchant</span> <span style="color:blue;font-weight:bold;">-exif</span> (<span style="color:blue;font-weight:bold;">-firebird</span>) <span style="color:blue;font-weight:bold;">-flatfile</span> <span style="color:blue;font-weight:bold;">-fpm</span> <span style="color:blue;font-weight:bold;">-ftp</span> <span style="color:blue;font-weight:bold;">-gd</span> <span style="color:blue;font-weight:bold;">-gmp</span> <span style="color:blue;font-weight:bold;">-imap</span> <span style="color:blue;font-weight:bold;">-inifile</span> <span style="color:blue;font-weight:bold;">-intl</span> <span style="color:blue;font-weight:bold;">-iodbc</span> <span style="color:blue;font-weight:bold;">-kerberos</span> <span style="color:blue;font-weight:bold;">-ldap</span> <span style="color:blue;font-weight:bold;">-ldap-sasl</span> <span style="color:blue;font-weight:bold;">-libedit</span> <span style="color:blue;font-weight:bold;">-libressl</span> <span style="color:blue;font-weight:bold;">-lmdb</span> <span style="color:blue;font-weight:bold;">-mhash</span> <span style="color:blue;font-weight:bold;">-mssql</span> <span style="color:blue;font-weight:bold;">-mysql</span> <span style="color:blue;font-weight:bold;">-mysqli</span> <span style="color:blue;font-weight:bold;">-oci8-instant-client</span> <span style="color:blue;font-weight:bold;">-odbc</span> <span style="color:blue;font-weight:bold;">-pcntl</span> <span style="color:blue;font-weight:bold;">-pdo</span> <span style="color:blue;font-weight:bold;">-phpdbg</span> <span style="color:blue;font-weight:bold;">-postgres</span> <span style="color:blue;font-weight:bold;">-qdbm</span> <span style="color:blue;font-weight:bold;">-recode</span> (<span style="color:blue;font-weight:bold;">-selinux</span>) <span style="color:blue;font-weight:bold;">-session-mm</span> <span style="color:blue;font-weight:bold;">-sharedmem</span> <span style="color:blue;font-weight:bold;">-snmp</span> <span style="color:blue;font-weight:bold;">-soap</span> <span style="color:blue;font-weight:bold;">-sockets</span> <span style="color:blue;font-weight:bold;">-sodium</span> <span style="color:blue;font-weight:bold;">-spell</span> <span style="color:blue;font-weight:bold;">-sqlite</span> <span style="color:blue;font-weight:bold;">-systemd</span> <span style="color:blue;font-weight:bold;">-sysvipc</span> <span style="color:blue;font-weight:bold;">-test</span> <span style="color:blue;font-weight:bold;">-threads</span> <span style="color:blue;font-weight:bold;">-tidy</span> <span style="color:blue;font-weight:bold;">-tokyocabinet</span> <span style="color:blue;font-weight:bold;">-truetype</span> <span style="color:blue;font-weight:bold;">-wddx</span> <span style="color:blue;font-weight:bold;">-webp</span> <span style="color:blue;font-weight:bold;">-xmlreader</span> <span style="color:blue;font-weight:bold;">-xmlrpc</span> <span style="color:blue;font-weight:bold;">-xmlwriter</span> <span style="color:blue;font-weight:bold;">-xpm</span> <span style="color:blue;font-weight:bold;">-xslt</span> <span style="color:blue;font-weight:bold;">-zip</span> <span style="color:blue;font-weight:bold;">-zip-encryption</span>&quot; 
</pre>

---

```bash
export USE="gd"
```

---

<pre class="console">
Calculating dependencies  ... done!
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">dev-libs/oniguruma-6.9.0</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-crnl-as-line-terminator</span> <span style="color:blue;font-weight:bold;">-static-libs</span>&quot; ABI_X86=&quot;(<span style="color:red;font-weight:bold;">64</span>) <span style="color:blue;font-weight:bold;">-32</span> (<span style="color:blue;font-weight:bold;">-x32</span>)&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">media-libs/libpng-1.6.35-r1</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-apng</span> (<span style="color:blue;font-weight:bold;">-neon</span>) <span style="color:blue;font-weight:bold;">-static-libs</span>&quot; ABI_X86=&quot;(<span style="color:red;font-weight:bold;">64</span>) <span style="color:blue;font-weight:bold;">-32</span> (<span style="color:blue;font-weight:bold;">-x32</span>)&quot; CPU_FLAGS_X86=&quot;<span style="color:red;font-weight:bold;">sse</span>&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">dev-lang/nasm-2.14.02</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-doc</span>&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">app-eselect/eselect-php-0.9.4-r5</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-apache2</span> <span style="color:blue;font-weight:bold;">-fpm</span>&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">media-libs/libjpeg-turbo-1.5.3-r2</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-java</span> <span style="color:blue;font-weight:bold;">-static-libs</span>&quot; ABI_X86=&quot;(<span style="color:red;font-weight:bold;">64</span>) <span style="color:blue;font-weight:bold;">-32</span> (<span style="color:blue;font-weight:bold;">-x32</span>)&quot; 
[<span style="color:green;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;">virtual/jpeg-0-r2</span>  USE=&quot;<span style="color:blue;font-weight:bold;">-static-libs</span>&quot; ABI_X86=&quot;(<span style="color:red;font-weight:bold;">64</span>) <span style="color:blue;font-weight:bold;">-32</span> (<span style="color:blue;font-weight:bold;">-x32</span>)&quot; 
[<span style="color:green;font-weight:bold;">ebuild</span>  <span style="color:green;font-weight:bold;">N</span>     ] <span style="color:green;font-weight:bold;">dev-lang/php-7.2.14</span>  USE=&quot;<span style="color:red;font-weight:bold;">acl</span> <span style="color:red;font-weight:bold;">berkdb</span> <span style="color:red;font-weight:bold;">bzip2</span> <span style="color:red;font-weight:bold;">cli</span> <span style="color:red;font-weight:bold;">ctype</span> <span style="color:red;font-weight:bold;">fileinfo</span> <span style="color:red;font-weight:bold;">filter</span> <span style="color:red;font-weight:bold;">gd</span> <span style="color:red;font-weight:bold;">gdbm</span> <span style="color:red;font-weight:bold;">hash</span> <span style="color:red;font-weight:bold;">iconv</span> <span style="color:red;font-weight:bold;">ipv6</span> <span style="color:red;font-weight:bold;">json</span> <span style="color:red;font-weight:bold;">nls</span> <span style="color:red;font-weight:bold;">opcache</span> <span style="color:red;font-weight:bold;">phar</span> <span style="color:red;font-weight:bold;">posix</span> <span style="color:red;font-weight:bold;">readline</span> <span style="color:red;font-weight:bold;">session</span> <span style="color:red;font-weight:bold;">simplexml</span> <span style="color:red;font-weight:bold;">ssl</span> <span style="color:red;font-weight:bold;">tokenizer</span> <span style="color:red;font-weight:bold;">unicode</span> <span style="color:red;font-weight:bold;">xml</span> <span style="color:red;font-weight:bold;">zlib</span> <span style="color:blue;font-weight:bold;">-apache2</span> <span style="color:blue;font-weight:bold;">-argon2</span> <span style="color:blue;font-weight:bold;">-bcmath</span> <span style="color:blue;font-weight:bold;">-calendar</span> <span style="color:blue;font-weight:bold;">-cdb</span> <span style="color:blue;font-weight:bold;">-cgi</span> <span style="color:blue;font-weight:bold;">-cjk</span> <span style="color:blue;font-weight:bold;">-coverage</span> <span style="color:blue;font-weight:bold;">-curl</span> <span style="color:blue;font-weight:bold;">-debug</span> <span style="color:blue;font-weight:bold;">-embed</span> <span style="color:blue;font-weight:bold;">-enchant</span> <span style="color:blue;font-weight:bold;">-exif</span> (<span style="color:blue;font-weight:bold;">-firebird</span>) <span style="color:blue;font-weight:bold;">-flatfile</span> <span style="color:blue;font-weight:bold;">-fpm</span> <span style="color:blue;font-weight:bold;">-ftp</span> <span style="color:blue;font-weight:bold;">-gmp</span> <span style="color:blue;font-weight:bold;">-imap</span> <span style="color:blue;font-weight:bold;">-inifile</span> <span style="color:blue;font-weight:bold;">-intl</span> <span style="color:blue;font-weight:bold;">-iodbc</span> <span style="color:blue;font-weight:bold;">-kerberos</span> <span style="color:blue;font-weight:bold;">-ldap</span> <span style="color:blue;font-weight:bold;">-ldap-sasl</span> <span style="color:blue;font-weight:bold;">-libedit</span> <span style="color:blue;font-weight:bold;">-libressl</span> <span style="color:blue;font-weight:bold;">-lmdb</span> <span style="color:blue;font-weight:bold;">-mhash</span> <span style="color:blue;font-weight:bold;">-mssql</span> <span style="color:blue;font-weight:bold;">-mysql</span> <span style="color:blue;font-weight:bold;">-mysqli</span> <span style="color:blue;font-weight:bold;">-oci8-instant-client</span> <span style="color:blue;font-weight:bold;">-odbc</span> <span style="color:blue;font-weight:bold;">-pcntl</span> <span style="color:blue;font-weight:bold;">-pdo</span> <span style="color:blue;font-weight:bold;">-phpdbg</span> <span style="color:blue;font-weight:bold;">-postgres</span> <span style="color:blue;font-weight:bold;">-qdbm</span> <span style="color:blue;font-weight:bold;">-recode</span> (<span style="color:blue;font-weight:bold;">-selinux</span>) <span style="color:blue;font-weight:bold;">-session-mm</span> <span style="color:blue;font-weight:bold;">-sharedmem</span> <span style="color:blue;font-weight:bold;">-snmp</span> <span style="color:blue;font-weight:bold;">-soap</span> <span style="color:blue;font-weight:bold;">-sockets</span> <span style="color:blue;font-weight:bold;">-sodium</span> <span style="color:blue;font-weight:bold;">-spell</span> <span style="color:blue;font-weight:bold;">-sqlite</span> <span style="color:blue;font-weight:bold;">-systemd</span> <span style="color:blue;font-weight:bold;">-sysvipc</span> <span style="color:blue;font-weight:bold;">-test</span> <span style="color:blue;font-weight:bold;">-threads</span> <span style="color:blue;font-weight:bold;">-tidy</span> <span style="color:blue;font-weight:bold;">-tokyocabinet</span> <span style="color:blue;font-weight:bold;">-truetype</span> <span style="color:blue;font-weight:bold;">-wddx</span> <span style="color:blue;font-weight:bold;">-webp</span> <span style="color:blue;font-weight:bold;">-xmlreader</span> <span style="color:blue;font-weight:bold;">-xmlrpc</span> <span style="color:blue;font-weight:bold;">-xmlwriter</span> <span style="color:blue;font-weight:bold;">-xpm</span> <span style="color:blue;font-weight:bold;">-xslt</span> <span style="color:blue;font-weight:bold;">-zip</span> <span style="color:blue;font-weight:bold;">-zip-encryption</span>&quot; 
</pre>

---

# I **❤** Gentoo

---

```bash
COMMON_DEPEND="
    ...
	gd? ( virtual/jpeg:0 media-libs/libpng:0= sys-libs/zlib )
	...
"
```

<small>https://packages.gentoo.org/packages/dev-lang/php</small>

---

```dockerfile
FROM gentoo/portage:latest AS portage

FROM gentoo/stage3-amd64:latest AS base

COPY --from=portage /usr/portage /usr/portage
```

---

```bash
docker image ls | grep gentoo
```

---

<pre class="console">
REPOSITORY           TAG     IMAGE ID      SIZE
gentoo               latest  2f8ba0f890ca  <strong>1.39GB</strong>
gentoo/stage3-amd64  latest  74668220e273  1.17GB
gentoo/portage       latest  b26d401ca17b  222MB
</pre>

---

<img src="portage.jpg" alt="" class="plain" />

---

<img src="phone-bill.jpg" alt="" class="plain" />

---

# **👉** Your images should contain only as much as you need.

---

```dockerfile
RUN mkdir -p /destination/
ENV ROOT=/destination
```

---

```dockerfile
# Previous steps here
RUN emerge dev-lang/php
```

---

<img src="build.jpg" alt="" class="plain" />

---

<pre class="console"
<span style="color:red;font-weight:bold;"> * </span>FAILED postinst: 1
<span style="color:red;font-weight:bold;"> * </span>ERROR: dev-lang/php-7.2.14::gentoo failed (postinst phase):
<span style="color:red;font-weight:bold;"> * </span>  (no error message)
<span style="color:red;font-weight:bold;"> * </span>
<span style="color:red;font-weight:bold;"> * </span>Call stack:
<span style="color:red;font-weight:bold;"> * </span>    ebuild.sh, line 124:  Called pkg_postinst
<span style="color:red;font-weight:bold;"> * </span>  environment, line 2085:  Called die
<span style="color:red;font-weight:bold;"> * </span>The specific snippet of code:
<span style="color:red;font-weight:bold;"> * </span>                  eselect php set $m php${SLOT} || die;
<span style="color:red;font-weight:bold;"> * </span>
<span style="color:red;font-weight:bold;"> * </span>If you need support, post the output of `emerge --info '=dev-lang/php-7.2.14::gentoo'`,
<span style="color:red;font-weight:bold;"> * </span>the complete build log and the output of `emerge -pqv '=dev-lang/php-7.2.14::gentoo'`.
<span style="color:red;font-weight:bold;"> * </span>The complete build log is located at '/var/tmp/portage/dev-lang/php-7.2.14/temp/build.log'.
<span style="color:red;font-weight:bold;"> * </span>The ebuild environment file is located at '/var/tmp/portage/dev-lang/php-7.2.14/temp/environment'.
<span style="color:red;font-weight:bold;"> * </span>Working directory: '/var/tmp/portage/dev-lang/php-7.2.14/homedir'
<span style="color:red;font-weight:bold;"> * </span>S: '/var/tmp/portage/dev-lang/php-7.2.14/work/php-7.2.14'
</pre>

---

# ☹

---

```dockerfile
# Previous steps here

RUN emerge dev-lang/php
ENV ROOT=/destination
RUN emerge dev-lang/php
```

---

# **👉** Software can have hidden dependencies

<small>Not just in Gentoo</small>

---

```dockerfile
RUN emerge sys-libs/timezone-data
```

---

<pre class="console">
REPOSITORY           TAG     IMAGE ID      SIZE
janoszen/php         latest  2f8ba0f890ca  <strong>1.48GB</strong>
</pre>

---

<img src="weight-loss.jpg" alt="" class="plain" />

---

```dockerfile
# Previous steps here

FROM scratch

COPY --from=base /destination /
```

---

<pre class="console">
TODO: add stats
</pre>

---

# **👉** Multi-stage builds get rid of the previous Docker layers

---

```dockerfile
FROM ubuntu
RUN apt-get update -y \
    && apt-get install -y php \
    && rm -rf rm -rf /var/lib/apt/lists/*
```

---

```dockerfile
FROM ubuntu AS base
RUN apt-get update -y
RUN apt-get install -y php
RUN rm -rf rm -rf /var/lib/apt/lists/*
FROM ubuntu AS final
COPY --from base / /
```

---

```dockerfile
RUN emerge -C \
    app-admin/select \
    app-admin/metalog \
    app-eselect/eselect-php \
    mail-mta/nullmailer \
    sys-apps/coreutils \
    sys-apps/file \
    sys-apps/sed \
    sys-apps/shadow \
    sys-libs/ncurses
```

---

# **👉** Generic OS images contain unnecessary packages

---

```dockerfile
RUN rm -rf \
        /destination/usr/share/doc \
        /destination/usr/share/gtk-doc \
        /destination/usr/share/eselect \
        /destination/usr/share/info \
        /destination/usr/share/man \
        /destination/var/db/pkg \
        /destination/usr/lib64/php7.2/include \
        /destination/usr/lib64/php7.2/lib/build \
        /destination/usr/share/aclocal \
        /destination/usr/share/gettext \
        /destination/usr/include \
        /destination/var/lib/gentoo \
        /destination/var/lib/portage \
        /destination/var/cache/edb
```

---

# **👉** OS packages often include documentation and tools you don't need

---

<pre class="console">
TODO: add final stats
</pre>

---

# Debugging minimalistic containers

---

```bash
export TARGET="target container ID here"
docker run \
  --pid container:$TARGET \
  --net container:$TARGET \
  --cap-add NET_RAW \
  --cap-add NET_ADMIN \
  --cap-add SYS_PTRACE \
  -ti
  janoszen/debug
```

---

# **👉** Use separate debug containers to fix issues

---

# Applying it to your every day workflows

---

```dockerfile
# Fat builder image
FROM ubuntu AS base
# Install build tools
RUN install-build-dependencies
# Copy source code to container
COPY . /usr/src/yourapp
# Run the build
RUN /usr/src/yourapp/build.sh

# New image from minimalistic base image
FROM alpine AS final
# Copy build artifacts to new image
COPY --from=base /usr/src/yourapp/dist/* /srv/app
# Run your application on boot
CMD ["/srv/app/yourapp"]
```

---

# The Kubler Project

<small>Getting Gentoo production-ready</small>

---

**❤** https://github.com/edannenberg/kubler

---

<pre class="console">
$ ./kubler.sh new namespace janoszen

<enter> to accept default value

Namespace Type:          local

New namespace location:  /home/janoszen/janoszen/kubler/dock/janoszen

--> Who maintains the new namespace?
Name: Janos Pasztor
EMail: j****@pasztor.at
--> What type of images would you like to build?
Engine (docker): 
*** Successfully created "janoszen" namespace at /home/janoszen/janoszen/kubler/dock/janoszen
</pre>

---

<pre class="console">
$ ./kubler.sh new image janoszen/php
  
<enter> to accept default value

--> Extend an existing image? Fully qualified image id (i.e. kubler/busybox) if yes or scratch
Parent Image (scratch): 
*** Successfully created image "php" in namespace "janoszen" at /home/janoszen/janoszen/kubler/dock/janoszen/images/php
</pre>

---

# build.conf

```bash
#BUILDER="kubler/bob"

#BUILDER_CAPS_SYS_PTRACE=true

#BUILDER_MOUNTS=("${_KUBLER_DIR}/tmp/somepath:/path/in/builder:ro")
#PARENT_BUILDER_MOUNTS='true'

#BUILDER_DOCKER_ARGS=('--cap-add' 'FOO')

IMAGE_PARENT="scratch"
```

---

# build.sh

```bash
_packages="dev-lang/php"

configure_bob()
{
    :
}

configure_rootfs_build()
{
    :
}

finish_rootfs_build()
{
    :
}
```

---

# Dockerfile.template

```dockerfile
FROM ${IMAGE_PARENT}
LABEL maintainer ${MAINTAINER}

ADD rootfs.tar /

#CMD ["/bin/some-cmd", "--some-option", "some-value"]
```

---

<pre class="console">
TODO add build results
</pre>

---

# Things to take home

- **👉** Build minimalistic images
- **👉** Software can have hidden dependencies.
- **👉** Use multi-stage builds to squash layers
- **👉** OS base images often contain extra stuff
- **👉** OS packages often include documentation
- **👉** Use separate debug containers to fix issues

---

## Questions?

Follow me: @janoszen

www.pasztor.at

---

