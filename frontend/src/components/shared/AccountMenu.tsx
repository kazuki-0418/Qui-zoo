import Image from "next/image";
import Link from "next/link";

type AccountMenuProps = {
  handleMenuItemClick: () => void;
  handleLogout: () => void;
};

export function AccountMenu({ handleMenuItemClick, handleLogout }: AccountMenuProps) {
  const menuItemClass =
    "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left";
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg p-2 z-50 border border-gray-200">
      <Link href="/setting" onClick={handleMenuItemClick} className={menuItemClass}>
        <Image
          src="/assets/icons/setting.svg"
          alt="user setting"
          className="mr-3"
          width={20}
          height={20}
        />
        Setting
      </Link>
      <button
        onClick={() => {
          handleMenuItemClick();
          handleLogout();
        }}
        className={menuItemClass}
      >
        <Image src="/assets/icons/door.svg" alt="logout" className="mr-3" width={20} height={20} />
        Logout
      </button>
    </div>
  );
}
