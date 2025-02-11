import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

interface PageProps {
    params: {
        category: string;
        slug: string;
    };
}

// Helper function to get the title from an MDX file
const getMdxTitle = (category: string, slug: string) => {
    const filePath = path.join(process.cwd(), "src", "content", category, `${slug}.mdx`);
    try {
        const source = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(source);
        return data.title || slug; // Fallback to slug if title is missing
    } catch (error) {
        console.error(`Error reading MDX file ${slug}:`, error);
        return slug; // Fallback to slug if there's an error
    }
};

// Function to get all MDX files with their titles
const getAllMdxFiles = (category: string) => {
    const directoryPath = path.join(process.cwd(), "src", "content", category);
    try {
        const fileNames = fs.readdirSync(directoryPath);
        return fileNames
            .filter((fileName) => fileName.endsWith(".mdx"))
            .map((fileName) => {
                const slug = fileName.replace(/\.mdx$/, "");
                const title = getMdxTitle(category, slug);
                return { slug, title };
            });
    } catch (error) {
        console.error(`Error reading directory ${category}:`, error);
        return [];
    }
};

// Generate static paths
export async function generateStaticParams() {
    const contentPath = path.join(process.cwd(), "src", "content");
    const categories = fs.readdirSync(contentPath);
    const paths: { category: string; slug: string }[] = [];

    categories.forEach((category) => {
        const mdxFiles = getAllMdxFiles(category);
        mdxFiles.forEach((file) => {
            paths.push({ category, slug: file.slug });
        });
    });

    return paths;
}

const DocPage = async ({ params }: PageProps) => {
    const { category, slug } = params;

    // Read the MDX file
    const filePath = path.join(process.cwd(), "src", "content", category, `${slug}.mdx`);
    try {
        const source = fs.readFileSync(filePath, "utf-8");
        const { content, data } = matter(source);

        // Get all MDX files in the current category with their titles
        const mdxFiles = getAllMdxFiles(category);

        return (
            <main className="flex flex-col-reverse lg:flex-row relative h-[90vh] overflow-x-hidden w-full justify-between">
                {/* Sidebar */}
                <section className="w-[100%] lg:w-[20%] border border-r-3 max-h-[88vh] overflow-y-scroll absolute lg:sticky top-0 bg-slate-50 dark:bg-bgDark z-20 py-2 dark:border-gray-700 lg:block">
                    <p className="mt-4 text-center font-semibold capitalize">{category}</p>

                    {/* List of MDX files in the current category */}
                    <ul className="flex flex-col gap-1 mt-5">
                        {mdxFiles.map((file) => (
                            <Link key={file.slug} href={`/doc/${category}/${file.slug}`}>
                                <li
                                    className={`capitalize text-sm font-bold rounded-sm px-2 py-3 md:py-2 sm:py-4 list-none cursor-pointer border-b border-gray-200 dark:text-gray-300 ${file.slug === slug
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-gray-300 dark:hover:bg-black"
                                        }`}
                                >
                                    {file.title}
                                </li>
                            </Link>
                        ))}
                    </ul>

                    {mdxFiles.length === 0 && (
                        <span className="text-center text-sm mx-auto block my-2">
                            No documents found.
                        </span>
                    )}
                </section>

                {/* Main Content */}
                <section className="lg:w-[60%] prose lg:prose-xl dark:prose-invert px-3 border overflow-y-scroll mx-0">
                    <div className="dark:border-gray-700 font-bold text-gray-800 dark:text-gray-300 flex items-center border border-solid border-gray-200 border-t-0 border-l-0 border-r-0 justify-between">
                        <h2 className="text-md lg:text-2xl">
                            {data?.title}</h2>
                    </div>

                    <MDXRemote source={content} />

                </section>

                {/* Right Section */}
                <section className="lg:w-[20%] border"></section>
            </main>
        );
    } catch (error) {
        console.error("Error reading MDX file:", error);
        return <div>Error loading content.</div>;
    }
};

export default DocPage;