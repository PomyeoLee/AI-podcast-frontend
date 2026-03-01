import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface BackgroundOverride {
  originalUrl: string
  overrideUrl: string
  createdAt: string
}

interface OverrideData {
  overrides: BackgroundOverride[]
  lastUpdated: string | null
}

const DATA_FILE = path.join(process.cwd(), 'data', 'background-overrides.json')

async function readOverrides(): Promise<OverrideData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is corrupted, return default structure
    return { overrides: [], lastUpdated: null }
  }
}

async function writeOverrides(data: OverrideData): Promise<void> {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(DATA_FILE)
    await fs.mkdir(dataDir, { recursive: true })
    
    // Write the data
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing background overrides:', error)
    throw error
  }
}

// GET - Fetch all background overrides
export async function GET() {
  try {
    const data = await readOverrides()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading background overrides:', error)
    return NextResponse.json(
      { error: 'Failed to read background overrides' },
      { status: 500 }
    )
  }
}

// POST - Add or update a background override
export async function POST(request: NextRequest) {
  try {
    const { originalUrl, overrideUrl }: { originalUrl: string; overrideUrl: string } = await request.json()
    
    if (!originalUrl || !overrideUrl) {
      return NextResponse.json(
        { error: 'Both originalUrl and overrideUrl are required' },
        { status: 400 }
      )
    }

    const data = await readOverrides()
    
    // Check if override for this original URL already exists
    const existingIndex = data.overrides.findIndex(o => o.originalUrl === originalUrl)
    
    const newOverride: BackgroundOverride = {
      originalUrl: originalUrl.trim(),
      overrideUrl: overrideUrl.trim(),
      createdAt: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      // Update existing override
      data.overrides[existingIndex] = newOverride
    } else {
      // Add new override
      data.overrides.push(newOverride)
    }

    data.lastUpdated = new Date().toISOString()
    await writeOverrides(data)

    return NextResponse.json({ 
      success: true, 
      override: newOverride,
      message: existingIndex >= 0 ? 'Override updated' : 'Override added'
    })
  } catch (error) {
    console.error('Error adding/updating background override:', error)
    return NextResponse.json(
      { error: 'Failed to save background override' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a background override
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const originalUrl = searchParams.get('originalUrl')
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'originalUrl parameter is required' },
        { status: 400 }
      )
    }

    const data = await readOverrides()
    const initialLength = data.overrides.length
    
    data.overrides = data.overrides.filter(o => o.originalUrl !== originalUrl)
    
    if (data.overrides.length === initialLength) {
      return NextResponse.json(
        { error: 'Override not found' },
        { status: 404 }
      )
    }

    data.lastUpdated = new Date().toISOString()
    await writeOverrides(data)

    return NextResponse.json({ 
      success: true, 
      message: 'Override removed'
    })
  } catch (error) {
    console.error('Error removing background override:', error)
    return NextResponse.json(
      { error: 'Failed to remove background override' },
      { status: 500 }
    )
  }
}
