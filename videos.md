---
title: Videos
layout: wall
description: Videos Janos Pasztor
---

{% assign posts = site.categories.videos | where_exp:"post","post.date < site.time" %}
<div class="wall">
<div class="wall__postlist">
{% for post in posts %}
{% include wall-post.html %}
{% endfor %}
</div>
</div>
