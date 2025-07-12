import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Handler to CREATE a new inquiry for a property
export const createInquiry = async (req, res) => {
  try {
    const { propertyId, guestName, guestContact, checkIn, checkOut, guestMessage } = req.body;

    // Basic validation
    if (!propertyId || !guestName || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Property ID, guest name, check-in, and check-out are required." });
    }

    const newInquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        guestName,
        guestContact,
        checkIn: new Date(checkIn), // Ensure date format is correct
        checkOut: new Date(checkOut),
        guestMessage,
      },
    });

    console.log('✅ Inquiry created successfully:', newInquiry);
    res.status(201).json(newInquiry);
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    res.status(500).json({ error: "Failed to create inquiry." });
  }
};

// Handler to GET all inquiries for a specific property
export const getInquiriesByProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' }, // Show newest first
    });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error(`❌ Error fetching inquiries for property ${propertyId}:`, error);
    res.status(500).json({ error: "Failed to fetch inquiries." });
  }
};
