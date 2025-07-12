import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /properties (Read All)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties." });
  }
};

// GET /properties/:id (Read One)
export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error(`❌ Error fetching property ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch property." });
  }
};

// POST /properties (Create)
export const createProperty = async (req, res) => {
  try {
    const { name, location, bedrooms, guests, calendarUrl } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required." });
    }
    const newProperty = await prisma.property.create({
      data: { name, location, bedrooms, guests, calendarUrl },
    });
    console.log('✅ Property created successfully:', newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("❌ Error creating property:", error);
    res.status(500).json({ error: "Failed to create property." });
  }
};

// PUT /properties/:id (Update)
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, location, bedrooms, guests, calendarUrl } = req.body;
  try {
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { name, location, bedrooms, guests, calendarUrl },
    });
    console.log('✅ Property updated successfully:', updatedProperty);
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error(`❌ Error updating property ${id}:`, error);
    res.status(500).json({ error: "Failed to update property." });
  }
};

// DELETE /properties/:id (Delete)
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({ where: { id } });
    console.log(`✅ Property ${id} deleted successfully.`);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(`❌ Error deleting property ${id}:`, error);
    res.status(500).json({ error: "Failed to delete property." });
  }
};
