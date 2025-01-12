import { MailIcon, PhoneIcon, SearchIcon } from "lucide-react";
import {socialLinks} from "@/lib/social"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export function TopBar() {
  return (
    <div className="container-section bg-white text-xs py-2 hidden  lg:flex  ">
      <div className="content-section  items-center flex justify-between ">
        <div className="flex items-center gap-8">
          <a href={"tel:"+socialLinks.phone} className="flex items-center gap-2 hover:text-primary">
            <PhoneIcon className="h-4 w-4 text-secondary" />
            <span className="text-gray-500">{socialLinks.phone}</span>
          </a>
          <a href={"mailto:"+socialLinks.email} className="flex items-center gap-2 hover:text-primary">
            <MailIcon className="h-4 w-4 text-accent" />
            <span className="text-gray-500">{socialLinks.email}</span>
          </a>
        </div>
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-64 pr-10 h-7 text-xs"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

