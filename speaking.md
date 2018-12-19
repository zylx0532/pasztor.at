---
title: Public speaking
layout: wall
description: Janos Pasztors public speaking engagements
---

<div class="cta">
<p>
    Are you organizing a conference? Do you want personalized workshops in your company or school? I am open for
    speaking engagements! <a href="/contact">Contact me &raquo;</a> 
</p>  
</div>

{% assign posts = site.categories.speaking | where_exp:"post","post.date < site.time" %}
<div class="wall">
<div class="wall__postlist">
{% for post in posts %}
{% include wall-post.html %}
{% endfor %}
</div>
</div>
