'use client'

import "@/styles/mdx.css"
import Link from 'next/link'
import { posts } from '#site/content'
import React, { useMemo, useState } from 'react'
import { notFound } from 'next/navigation'
import PostItems from '@/components/PostItems'
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MDXContent } from '@/components/mdx-component';
import { PostItemsProps } from '@/components/PostItems';
import { useResponsiveContext } from "@/context/CSS-Context";

const DocPage = ({ params }: { params: { category: string } }) => {

  const { category } = params

  const displayPosts = useMemo(() => {
    return posts?.filter((post) => post?.slug.indexOf(category) === 0 && post?.published)
  }, [posts])

  const [post, setPost] = useState<PostItemsProps | null>(displayPosts[0] || null);

  const [activeSlug, setActiveSlug] = useState(displayPosts[0]?.slug || '')

  const {
    isDocIndexOpen,
    setIsDocIndexOpen
  } = useResponsiveContext();



  const renderPost = (post: PostItemsProps) => {
    setPost(post)
    setActiveSlug(post?.slug)
  }


  return (
    <div className="flex flex-col-reverse lg:flex-row relative h-[90vh] overflow-x-hidden w-full justify-between">
      {/* Sidebar */}
      <section className={`w-[100%] lg:w-[20%] border border-r-3 max-h-[90vh] overflow-y-scroll absolute lg:sticky top-0 bg-slate-50 dark:bg-bgDark z-20 py-2 dark:border-gray-700 lg:block ${isDocIndexOpen ? "block" : "hidden"} lg:block`}>
        <p className="mt-4 text-center font-semibold capitalize">{category}</p>

        <ul className="flex flex-col gap-1 mt-5">
          {displayPosts?.map((post) => (
            <PostItems
              post={post}
              key={post?.slug}
              category={category}
              renderPost={renderPost}
              activeSlug={activeSlug}
            />
          ))}
        </ul>

        <span className="text-center text-sm mx-auto block my-2">
          No documents found.
        </span>

      </section>


      <section className="w-full lg:w-[60%] overflow-y-scroll">

        {post && <article className="container py-4 prose dark:prose-invert max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2">{post?.title}</h1>
              {post?.description ? (
                <p className="text-xl mt-0 text-muted-foreground">{post?.description}</p>
              ) : null}
            </div>

            <Link
              className="hidden lg:block"
              href={`/document/${post?.slugAsParams}`}><MdOutlineZoomOutMap className="h-5 w-5" /></Link>

          </div>

          <hr className="my-4" />
          <MDXContent code={post?.body} />
        </article>}

      </section>

      <section className="w-full lg:w-[20%] border">


      </section>
    </div>
  )
}

export default DocPage


