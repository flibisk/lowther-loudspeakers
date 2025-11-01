import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface BeehiivEmail {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  published_at: string;
  author?: string;
  images?: string[];
  category?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (you'll need to set this up in Beehiiv)
    const signature = request.headers.get('x-beehiiv-signature');
    const webhookSecret = process.env.BEEHIIV_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      // Add signature verification logic here
      // This is important for security
    }

    const beehiivEmail: BeehiivEmail = await request.json();
    
    // Process the email content
    const blogPost = await processBeehiivEmail(beehiivEmail);
    
    // Read current posts
    const postsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'posts.json');
    const postsData = JSON.parse(await fs.readFile(postsPath, 'utf8'));
    
    // Add new post to the beginning of the array
    postsData.unshift(blogPost);
    
    // Keep only the latest 50 posts
    if (postsData.length > 50) {
      postsData.splice(50);
    }
    
    // Write updated posts back to file
    await fs.writeFile(postsPath, JSON.stringify(postsData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post synced successfully',
      postId: blogPost.id 
    });
    
  } catch (error) {
    console.error('Error syncing Beehiiv email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync blog post' },
      { status: 500 }
    );
  }
}

async function processBeehiivEmail(email: BeehiivEmail): Promise<BlogPost> {
  // Generate slug from title
  const slug = email.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  // Extract excerpt from content (first 150 characters)
  const excerpt = email.excerpt || 
    email.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  // Estimate read time (average 200 words per minute)
  const wordCount = email.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  
  // Process images from content
  const imageMatches = email.content.match(/<img[^>]+src="([^"]+)"/g);
  const images = imageMatches?.map(match => {
    const srcMatch = match.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : null;
  }).filter(Boolean) || [];
  
  // Download and store images locally
  const localImages = await downloadImages(images);
  const featuredImage = localImages[0] || '/images/blog/default-blog-image.jpg';
  
  return {
    id: email.id || `post-${Date.now()}`,
    title: email.title,
    slug,
    excerpt,
    content: email.content,
    author: email.author || 'Lowther Team',
    publishedAt: email.published_at,
    readTime: `${readTime} min read`,
    category: email.category || 'News',
    image: featuredImage,
    featured: false
  };
}

async function downloadImages(imageUrls: string[]): Promise<string[]> {
  const localImages: string[] = [];
  
  for (const imageUrl of imageUrls.slice(0, 3)) { // Limit to 3 images
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const filename = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const filepath = path.join(process.cwd(), 'public', 'images', 'blog', filename);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        
        // Write file
        await fs.writeFile(filepath, Buffer.from(buffer));
        
        localImages.push(`/images/blog/${filename}`);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }
  
  return localImages;
}

// GET endpoint to manually trigger sync (for testing)
export async function GET() {
  return NextResponse.json({ 
    message: 'Beehiiv sync endpoint ready',
    instructions: 'Send POST request with Beehiiv email data to sync blog posts'
  });
}
