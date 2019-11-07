---
layout:        post
title:         "Building an API-driven software: OpenAPI"
date:          "0000-00-00"
categories:    blog
excerpt:       "Now that we have all the basics covered it is time to implement OpenAPI / Swagger in our project."
preview:       /assets/img/api-first-4.jpg
fbimage:       /assets/img/api-first-4.png
twitterimage:  /assets/img/api-first-4.png
googleimage:   /assets/img/api-first-4.png
twitter_card:  summary_large_image
tags:          [Development, Clean code, Java]
sharing:
  twitter:  "API-driven App: implementing OpenAPI / Swagger!"
  facebook: "API-driven App: implementing OpenAPI / Swagger!"
  linkedin: "API-driven App: implementing OpenAPI / Swagger!"
  patreon:  "API-driven App: implementing OpenAPI / Swagger!"
  discord:  "@everyone API-driven App: implementing OpenAPI / Swagger!"
---

In our [previous episode](/blog/api-first-3) we discussed how to set up the database access with our Spring Boot app.
Not it's time to set up the whole OpenAPI stuff.

## Source code

As previously, you can [grab the source code of the previous article](https://github.com/janoszen/api-first/tree/api-first-3)
from GitHub, and the [end result of this article as well](https://github.com/janoszen/api-first/tree/api-first-4).

## How Swagger is implemented

Spring Boot itself does not contain support for Swagger (the toolkit that enables OpenAPI). Luckily, a third party 
library, [Spring Fox](https://springfox.github.io/springfox/), does fill that gap. Once it is configured we need to 
annotate our data models and controllers with the appropriate annotations to convey information about the API.

## Dependencies

As a first step, we will add Spring Fox as a dependency:

```xml
<project>
    <!-- ... -->
    <dependencies>
        <!-- ... -->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
    </dependencies>
</project>
```

This will pull in a number of packages, including the Swagger annotations package, but not the UI, which we will add
later. For now let's just focus on getting the OpenAPI document up and running.

## Configuring Swagger

In order to use Swagger we will need to create a configuration class in our project. This configuration class is
automatically read and used by Spring Boot:

```java
package at.pasztor.backend;

import com.fasterxml.classmate.TypeResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {
    @Bean
    public Docket api(TypeResolver typeResolver) {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
            .paths(
                PathSelectors
                    .any()
            )
            .build()
            .pathMapping("/")
            .apiInfo(metadata())
            .forCodeGeneration(true)
            .useDefaultResponseMessages(false)
            ;
    }

    private static ApiInfo metadata() {
        return new ApiInfoBuilder()
            .title("pasztor.at API")
            .description(
                "This API exposes the pasztor.at functionality."
            )
            .version("1")
            .build();
    }
}
```

Let's unpack this a bit. First of all, the `@Configuration` annotation is the one that tells Spring Boot that this is
a configuration class and should be read. The `@EnableSwagger2` annotation enables Swagger to work at all.

Going on, you can see that there is a method called `api()` with an annotation called `@Bean`. This annotation declares
that this method should be called whenever a `Docket` object is needed for dependency injection.

The `Docket` itself contains the basic details about the generated OpenAPI document. Most importantly, we declare that
only classes that have the `RestController` annotation should be considered for the OpenAPI document.

If we now start our application and navigate to [http://localhost:8080/v2/api-docs](http://localhost:8080/v2/api-docs)
we will see a very detailed JSON output:

```json
{
  "swagger": "2.0",
  "info": {
    "description": "This API exposes the pasztor.at functionality.",
    "version": "1",
    "title": "pasztor.at API"
  },
  "host": "localhost:8080",
  "basePath": "/",
  "tags": [
    {
      "name": "blog-post-controller",
      "description": "Blog Post Controller"
    }
  ],
  "paths": {
    "/posts": {
      "get": {
        //...
      },
      "post": {
        //...
      }
    },
    "/posts/{slug}": {
      "get": {
        //...
      },
      "delete": {
        //...
      },
      "patch": {
        //...
      }
    }
  },
  "definitions": {
    //...
  }
}
```

As you can see, Spring Fox mapped our existing APIs pretty well even without us giving it any additional information.
This, of course, was also made possible because we coded it in a very clean fashion. However, some identifiers are
not exactly ideal and having documentation would also be nice.

## Adding API metadata

Let's annotate our classes a little bit so we have a nice API documentation. Let's start with the `BlogPostController`
and add an `@API` annotation:

```java
package at.pasztor.backend.post.api;

//...

@Api(
    tags = "Blog posts"
)
@RestController
@RequestMapping("/posts")
public class BlogPostController {
  //...
}
```

This simple annotation will add a proper tag name to the output, which will later show up nicely in the Swagger UI.
If you want, you can even add more details on the tags to the `Docket` in the config by adding the following section:

```java
return new Docket(DocumentationType.SWAGGER_2)
    //...
    .build()
    .tags(
        new Tag(
            "Blog posts",
            "Create, modify, delete and list blog posts"
        )
    )
```

This will add the additional description to the tag.

Next up, let's annotate our endpoint methods like this:

```java
@ApiOperation(
    nickname = "create",
    value = "Create a post",
    notes = "Creates a blog post by providing its details."
)
@RequestMapping(
        method = RequestMethod.POST,
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
)
public BlogPost create(
        @ApiParam(required = true)
        @RequestBody
        BlogPostCreateRequest request
) {
    //...
}
```

The `@ApiOperation` annotation provides additional context to the operation. The `nickname` parameter will be used
by code generation libraries to name the method, while the other parameters will be used for documentation purposes.

The `@ApiParam` annotation on the `request` variable declares, in this case, that the request is required. This will
not do any validation, but serve as code generation help, but more on code generation later. For now, let's just
focus on getting our documentation clear.

Our next target for annotations is the `BlogPostCreateRequest` object:

```java
package at.pasztor.backend.post.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Pattern;

public class BlogPostCreateRequest {
    @ApiModelProperty(
        required = true,
        value = "URL slug",
        notes = "URL part of this blog post.",
        allowableValues = "range(1,255)",
        position = 0
    )
    @Pattern(regexp = "[A-Za-z0-9\\-]+")
    @JsonProperty(required = true, index = 0)
    public final String slug;

    @ApiModelProperty(
        required = true,
        value = "Title",
        notes = "User-visible title of this post",
        allowableValues = "range(1,255)",
        position = 1
    )
    @JsonProperty(required = true, index = 1)
    public final String title;

    @ApiModelProperty(
        required = true,
        value = "Content",
        notes = "Content of this blog post",
        allowableValues = "range(0,65535)",
        position = 2,
        allowEmptyValue = true
    )
    @JsonProperty(required = true, index = 2)
    public final String content;

    public BlogPostCreateRequest(
            @JsonProperty(required = true)
            String slug,
            @JsonProperty(required = true)
            String title,
            @JsonProperty(required = true)
            String content
    ) {
        this.slug = slug;
        this.title = title;
        this.content = content;
    }
}
```

Now, this may seem strange. Why are the `@ApiModelProperty` annotations on the properties and not on the constructor
where the JSON decoding actually takes place?

As it turns out, Spring Fox / Swagger takes its property definitions off of properties or methods, but not constructor
parameters. This is different to how `@ApiParam` annotations are handled because in theory `BlogPostCreateRequest` could
also be an object that is returned to the user.

You may also notice that the `@ApiModelProperty` annotations contain quite some extra information. Most important to
us is the `required` field and the `allowableValues` field. The `required` field is useful because the automatic client
code generators will use it to determine if the developer on the &ldquo;other end&rdquo; has to do a `null` check or 
not.

The `allowableValues` on the other hand will give the client some useful hints on what is accepted or not. It can take
two forms: either a comma-separated list of values, or the formats `range[1,2]` or `range(1,2)`. The former will act 
like an enum, while the latter will determine the string length or acceptable number ranges for the input value.

> **Important!** The `@ApiModelProperty` annotation does not provide any validation, it only documents, unless you
> pull in and configure the `springfox-bean-validators` package. However, my preferred way is different.

Finally, before we get to validation, let's take a look at the entities. We can modify our `BlogPost` entity as follows:

```java
package at.pasztor.backend.post.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Pattern;

@Entity(name = "posts")
@Table(name = "posts")
public class BlogPost {
    @Id
    @Column(nullable = false)
    @ApiModelProperty(
        required = true,
        value = "URL slug",
        notes = "URL part of this blog post.",
        allowableValues = "range(1,255)",
        position = 0
    )
    @Pattern(regexp = "[A-Za-z0-9\\-]+")
    @JsonProperty(required = true, index = 0)
    public final String slug;

    @ApiModelProperty(
        required = true,
        value = "Title",
        notes = "User-visible title of this post",
        allowableValues = "range(1,255)",
        position = 1
    )
    @JsonProperty(required = true, index = 1)
    @Column(nullable = false)
    public final String title;

    @ApiModelProperty(
        required = true,
        value = "Content",
        notes = "Content of this blog post",
        allowableValues = "range(0,65535)",
        position = 2,
        allowEmptyValue = true
    )
    @JsonProperty(required = true, index = 2)
    @Column(nullable = false, length = 65535)
    public final String content;

    //...
}
```

Now, I know, this is getting pretty ugly, we'll clean this up a bit more in this article, and we will split it in the
next article.

## Validation

