import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllColors, getAllSizes } from "@/lib/supabase-query";
import SizeCardForm from "./_components/SizeCardForm";
import SizeCard from "./_components/SizeCard";
import ColorCardForm from "./_components/ColorCardForm";
import ColorCard from "./_components/ColorCard";

export default async function SettingsPage() {
  const colors = getAllColors();
  const sizes = getAllSizes();

  const [colorResponse, sizeResponse] = await Promise.all([colors, sizes]);

  const colorsData = colorResponse.colors;
  const sizesData = sizeResponse.sizes;
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="mt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <SizeCardForm />
              <div className="flex flex-wrap gap-4 p-6">
                {sizesData?.map((size, i) => (
                  <SizeCard size={size} key={i} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <ColorCardForm />
              <div className="flex flex-wrap gap-4 p-6">
                {colorsData?.map((color, i) => (
                  <ColorCard color={color} key={i} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
